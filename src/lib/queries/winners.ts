import "server-only";

import { createClient } from "@/lib/supabase/server";
import { WINNERS_PAGE_SIZE, WINNERS_EXPORT_LIMIT } from "@/constants";
import type { WinnerStatus } from "@/types";

export interface WinnerFilters {
  search?: string;
  status?: WinnerStatus | "all";
  gameId?: string;
  prizeId?: string;
  from?: string; // ISO date (inclusive)
  to?: string; // ISO date (inclusive)
}

export interface WinnerListItem {
  id: string;
  player_name: string | null;
  player_contact: string | null;
  status: WinnerStatus;
  won_at: string;
  game_name: string;
  prize_name: string;
}

async function withNameLookups(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: { game_id: string; prize_id: string }[]
) {
  const gameIds = [...new Set(rows.map((r) => r.game_id))];
  const prizeIds = [...new Set(rows.map((r) => r.prize_id))];

  const [gamesRes, prizesRes] = await Promise.all([
    gameIds.length > 0
      ? supabase.from("games").select("id, name").in("id", gameIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    prizeIds.length > 0
      ? supabase.from("prizes").select("id, name").in("id", prizeIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ]);

  return {
    gameNameById: new Map((gamesRes.data ?? []).map((g) => [g.id, g.name])),
    prizeNameById: new Map((prizesRes.data ?? []).map((p) => [p.id, p.name])),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query: any, filters: WinnerFilters) {
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.gameId) {
    query = query.eq("game_id", filters.gameId);
  }
  if (filters.prizeId) {
    query = query.eq("prize_id", filters.prizeId);
  }
  if (filters.from) {
    query = query.gte("won_at", filters.from);
  }
  if (filters.to) {
    query = query.lte("won_at", filters.to);
  }
  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(`player_name.ilike.%${term}%,player_contact.ilike.%${term}%`);
  }
  return query;
}

export interface ListWinnersResult {
  winners: WinnerListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export async function listWinnerRecords(
  filters: WinnerFilters & { page?: number; pageSize?: number }
): Promise<ListWinnersResult> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? WINNERS_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("winner_records")
    .select("id, player_name, player_contact, status, won_at, game_id, prize_id", {
      count: "exact",
    })
    .order("won_at", { ascending: false })
    .range(from, to);

  query = applyFilters(query, filters);

  const { data, count } = await query;
  const rows = data ?? [];
  const { gameNameById, prizeNameById } = await withNameLookups(supabase, rows);

  const winners: WinnerListItem[] = rows.map((row) => ({
    id: row.id,
    player_name: row.player_name,
    player_contact: row.player_contact,
    status: row.status,
    won_at: row.won_at,
    game_name: gameNameById.get(row.game_id) ?? "Unknown game",
    prize_name: prizeNameById.get(row.prize_id) ?? "Unknown prize",
  }));

  const total = count ?? 0;

  return {
    winners,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Same filters as listWinnerRecords, but unpaginated (capped) -- for CSV/Excel export. */
export async function listWinnerRecordsForExport(
  filters: WinnerFilters
): Promise<WinnerListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("winner_records")
    .select("id, player_name, player_contact, status, won_at, game_id, prize_id")
    .order("won_at", { ascending: false })
    .limit(WINNERS_EXPORT_LIMIT);

  query = applyFilters(query, filters);

  const { data } = await query;
  const rows = data ?? [];
  const { gameNameById, prizeNameById } = await withNameLookups(supabase, rows);

  return rows.map((row) => ({
    id: row.id,
    player_name: row.player_name,
    player_contact: row.player_contact,
    status: row.status,
    won_at: row.won_at,
    game_name: gameNameById.get(row.game_id) ?? "Unknown game",
    prize_name: prizeNameById.get(row.prize_id) ?? "Unknown prize",
  }));
}

export interface WinnerDetail {
  id: string;
  player_name: string | null;
  player_contact: string | null;
  status: WinnerStatus;
  won_at: string;
  claimed_at: string | null;
  cancelled_at: string | null;
  game: { id: string; name: string } | null;
  prize: { id: string; name: string; image_url: string | null; value: number } | null;
  session: { id: string; score: number; started_at: string; ended_at: string | null } | null;
}

export async function getWinnerDetail(id: string): Promise<WinnerDetail | null> {
  const supabase = await createClient();

  const { data: winner } = await supabase.from("winner_records").select("*").eq("id", id).maybeSingle();
  if (!winner) return null;

  const [gameRes, prizeRes, sessionRes] = await Promise.all([
    supabase.from("games").select("id, name").eq("id", winner.game_id).maybeSingle(),
    supabase
      .from("prizes")
      .select("id, name, image_url, value")
      .eq("id", winner.prize_id)
      .maybeSingle(),
    supabase
      .from("game_sessions")
      .select("id, score, started_at, ended_at")
      .eq("id", winner.game_session_id)
      .maybeSingle(),
  ]);

  return {
    id: winner.id,
    player_name: winner.player_name,
    player_contact: winner.player_contact,
    status: winner.status,
    won_at: winner.won_at,
    claimed_at: winner.claimed_at,
    cancelled_at: winner.cancelled_at,
    game: gameRes.data ?? null,
    prize: prizeRes.data ?? null,
    session: sessionRes.data ?? null,
  };
}

export interface OptionItem {
  id: string;
  label: string;
}

export async function getGameOptions(): Promise<OptionItem[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("games").select("id, name").order("name");
  return (data ?? []).map((g) => ({ id: g.id, label: g.name }));
}

export async function getActivePrizeOptions(): Promise<OptionItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prizes")
    .select("id, name")
    .eq("is_active", true)
    .order("name");
  return (data ?? []).map((p) => ({ id: p.id, label: p.name }));
}

export interface SessionOption {
  id: string;
  label: string;
}

/** Recent completed sessions, for the "record a win manually" form's session picker. */
export async function getRecentCompletedSessions(limit = 50): Promise<SessionOption[]> {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("game_sessions")
    .select("id, game_id, player_name, started_at")
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(limit);

  const rows = sessions ?? [];
  const gameIds = [...new Set(rows.map((r) => r.game_id))];
  const { data: games } =
    gameIds.length > 0
      ? await supabase.from("games").select("id, name").in("id", gameIds)
      : { data: [] as { id: string; name: string }[] };
  const gameNameById = new Map((games ?? []).map((g) => [g.id, g.name]));

  return rows.map((s) => {
    const date = new Date(s.started_at).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const gameName = gameNameById.get(s.game_id) ?? "Unknown game";
    const player = s.player_name ?? "Anonymous player";
    return { id: s.id, label: `${player} — ${gameName} — ${date}` };
  });
}
