import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PrizeType } from "@/types";

/**
 * Anonymous-safe read queries backing the public homepage. Unlike
 * `queries/prizes.ts` / `queries/winners.ts` (which assume an authenticated
 * admin session and read admin-only columns), these rely entirely on the
 * public RLS policies on `prizes` (`is_active = true`) and the
 * `recent_winners_feed` view -- no admin session required, no
 * `prize_inventory` access (admin-only), no private columns.
 */

export interface PublicPrizeItem {
  id: string;
  name: string;
  prize_type: PrizeType;
  probability_weight: number;
}

/**
 * Active prizes for the homepage Prize Wheel. Returns [] (not an error) if
 * fewer than 0 exist -- callers decide the "not enough real prizes yet"
 * fallback threshold, since a single active prize isn't enough for a
 * meaningful wheel.
 */
export async function getActivePrizesForWheel(limit = 8): Promise<PublicPrizeItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prizes")
    .select("id, name, prize_type, probability_weight")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export interface RecentWinnerFeedItem {
  id: string;
  game_name: string;
  prize_name: string;
  player_display: string;
  won_at: string;
}

/** Recent wins for the public "Recent Winners" feed -- player names pre-masked by the view. */
export async function getRecentWinnersFeed(limit = 6): Promise<RecentWinnerFeedItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recent_winners_feed")
    .select("*")
    .order("won_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
