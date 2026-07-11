import "server-only";

import { createClient } from "@/lib/supabase/server";
import { PRIZES_PAGE_SIZE } from "@/constants";
import type { PrizeType } from "@/types";

export interface PrizeListItem {
  id: string;
  name: string;
  image_url: string | null;
  prize_type: PrizeType;
  value: number;
  is_active: boolean;
  quantity_total: number;
  quantity_awarded: number;
  quantity_available: number;
  low_stock_threshold: number;
}

export interface ListPrizesResult {
  prizes: PrizeListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export async function listPrizes({
  search = "",
  page = 1,
  pageSize = PRIZES_PAGE_SIZE,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<ListPrizesResult> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("prizes")
    .select("id, name, image_url, prize_type, value, is_active", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data: prizeRows, count } = await query;
  const prizes = prizeRows ?? [];

  const prizeIds = prizes.map((p) => p.id);
  let inventoryById = new Map<
    string,
    { quantity_total: number; quantity_awarded: number; quantity_available: number; low_stock_threshold: number }
  >();

  if (prizeIds.length > 0) {
    const { data: inventoryRows } = await supabase
      .from("prize_inventory")
      .select("prize_id, quantity_total, quantity_awarded, quantity_available, low_stock_threshold")
      .in("prize_id", prizeIds);

    inventoryById = new Map(
      (inventoryRows ?? []).map((row) => [
        row.prize_id,
        {
          quantity_total: row.quantity_total,
          quantity_awarded: row.quantity_awarded,
          quantity_available: row.quantity_available,
          low_stock_threshold: row.low_stock_threshold,
        },
      ])
    );
  }

  const merged: PrizeListItem[] = prizes.map((p) => {
    const inv = inventoryById.get(p.id);
    return {
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      prize_type: p.prize_type,
      value: p.value,
      is_active: p.is_active,
      quantity_total: inv?.quantity_total ?? 0,
      quantity_awarded: inv?.quantity_awarded ?? 0,
      quantity_available: inv?.quantity_available ?? 0,
      low_stock_threshold: inv?.low_stock_threshold ?? 0,
    };
  });

  const total = count ?? 0;

  return {
    prizes: merged,
    total,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export interface PrizeDetail {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  prize_type: PrizeType;
  value: number;
  probability_weight: number;
  is_active: boolean;
  quantity_total: number;
  quantity_awarded: number;
  quantity_available: number;
  low_stock_threshold: number;
}

export async function getPrizeById(id: string): Promise<PrizeDetail | null> {
  const supabase = await createClient();

  const { data: prize } = await supabase.from("prizes").select("*").eq("id", id).maybeSingle();
  if (!prize) return null;

  const { data: inventory } = await supabase
    .from("prize_inventory")
    .select("quantity_total, quantity_awarded, quantity_available, low_stock_threshold")
    .eq("prize_id", id)
    .maybeSingle();

  return {
    id: prize.id,
    name: prize.name,
    description: prize.description,
    image_url: prize.image_url,
    prize_type: prize.prize_type,
    value: prize.value,
    probability_weight: prize.probability_weight,
    is_active: prize.is_active,
    quantity_total: inventory?.quantity_total ?? 0,
    quantity_awarded: inventory?.quantity_awarded ?? 0,
    quantity_available: inventory?.quantity_available ?? 0,
    low_stock_threshold: inventory?.low_stock_threshold ?? 0,
  };
}
