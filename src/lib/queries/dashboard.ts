import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalGames: number;
  activeGames: number;
  totalPrizes: number;
  lowStockPrizes: number;
  totalSessions: number;
  sessionsToday: number;
  completedSessions: number;
  totalWinners: number;
  winnersToday: number;
  winRate: number;
  totalPrizeValueAwarded: number;
  averageScore: number;
}

function startOfTodayIso(): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

/**
 * Pulls the dashboard's operational + analytics numbers directly from the
 * base tables. Counts use PostgREST's `head: true` (no row payload); the
 * handful of aggregates without a dedicated column (win rate, prize value
 * awarded, average score) are computed in application code, which is fine
 * at this scale -- move these to the `analytics` table (populated by a
 * scheduled job) or a Postgres RPC once volume grows.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const todayIso = startOfTodayIso();

  const [
    totalGamesRes,
    activeGamesRes,
    totalPrizesRes,
    inventoryRes,
    totalSessionsRes,
    sessionsTodayRes,
    completedSessionsRes,
    totalWinnersRes,
    winnersTodayRes,
    wonRecordsRes,
    completedScoresRes,
  ] = await Promise.all([
    supabase.from("games").select("*", { count: "exact", head: true }),
    supabase
      .from("games")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("prizes").select("*", { count: "exact", head: true }),
    supabase
      .from("prize_inventory")
      .select("prize_id, quantity_available, low_stock_threshold"),
    supabase.from("game_sessions").select("*", { count: "exact", head: true }),
    supabase
      .from("game_sessions")
      .select("*", { count: "exact", head: true })
      .gte("started_at", todayIso),
    supabase
      .from("game_sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    supabase.from("winner_records").select("*", { count: "exact", head: true }),
    supabase
      .from("winner_records")
      .select("*", { count: "exact", head: true })
      .gte("won_at", todayIso),
    supabase.from("winner_records").select("prize_id").neq("status", "cancelled"),
    supabase.from("game_sessions").select("score").eq("status", "completed"),
  ]);

  const lowStockPrizes = (inventoryRes.data ?? []).filter(
    (row) => row.quantity_available <= row.low_stock_threshold
  ).length;

  const wonRecords = wonRecordsRes.data ?? [];
  const prizeIds = [...new Set(wonRecords.map((row) => row.prize_id))];

  let totalPrizeValueAwarded = 0;
  if (prizeIds.length > 0) {
    const { data: prizeRows } = await supabase
      .from("prizes")
      .select("id, value")
      .in("id", prizeIds);
    const valueById = new Map((prizeRows ?? []).map((p) => [p.id, p.value]));
    totalPrizeValueAwarded = wonRecords.reduce(
      (sum, row) => sum + (valueById.get(row.prize_id) ?? 0),
      0
    );
  }

  const scores = (completedScoresRes.data ?? []).map((row) => row.score);
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;

  const completedSessions = completedSessionsRes.count ?? 0;
  const totalWinners = totalWinnersRes.count ?? 0;
  const winRate =
    completedSessions > 0 ? Math.round((totalWinners / completedSessions) * 1000) / 10 : 0;

  return {
    totalGames: totalGamesRes.count ?? 0,
    activeGames: activeGamesRes.count ?? 0,
    totalPrizes: totalPrizesRes.count ?? 0,
    lowStockPrizes,
    totalSessions: totalSessionsRes.count ?? 0,
    sessionsToday: sessionsTodayRes.count ?? 0,
    completedSessions,
    totalWinners,
    winnersToday: winnersTodayRes.count ?? 0,
    winRate,
    totalPrizeValueAwarded,
    averageScore,
  };
}

export interface RecentWinnerRow {
  id: string;
  game_name: string;
  prize_name: string;
  player_display: string;
  won_at: string;
}

export async function getRecentWinners(limit = 5): Promise<RecentWinnerRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recent_winners_feed")
    .select("*")
    .limit(limit);

  return data ?? [];
}

export interface RecentActivityRow {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  adminName: string | null;
}

export async function getRecentActivity(limit = 8): Promise<RecentActivityRow[]> {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("id, action, entity_type, admin_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = logs ?? [];
  const adminIds = [...new Set(rows.map((row) => row.admin_id).filter((id): id is string => !!id))];

  let nameById = new Map<string, string>();
  if (adminIds.length > 0) {
    const { data: admins } = await supabase
      .from("admins")
      .select("id, full_name")
      .in("id", adminIds);
    nameById = new Map((admins ?? []).map((a) => [a.id, a.full_name]));
  }

  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    entity_type: row.entity_type,
    created_at: row.created_at,
    adminName: row.admin_id ? nameById.get(row.admin_id) ?? "Unknown" : null,
  }));
}
