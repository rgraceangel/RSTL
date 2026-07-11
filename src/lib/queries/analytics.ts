import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Read-only aggregates backing `/admin/analytics` (Section 17). Every
 * function here calls a SECURITY DEFINER Postgres RPC (see
 * `supabase/migrations/20260716010000_analytics_dashboard.sql`) that does
 * its own `count(*) filter (...)`/`group by` aggregation in the database,
 * rather than pulling every `game_sessions`/`winner_records` row into
 * application code the way `queries/dashboard.ts#getDashboardStats`
 * deliberately does as a documented stopgap ("fine at this scale... move to
 * a Postgres RPC once volume grows") -- PostgREST's query builder has no
 * `group by`, so a real breakdown (most popular game, a daily time series)
 * has to be a database-side aggregate. Every RPC re-checks `is_admin()`
 * itself; these functions never call `requireRole` client-side the way
 * `lib/actions/*.ts` write-actions do, since the authorization decision
 * already lives in the RPC and (belt-and-suspenders) the page itself only
 * renders inside the already-protected `/admin` route.
 */

export interface GamesPlayedSummary {
  totalSessions: number;
  completedSessions: number;
  inProgressSessions: number;
  abandonedSessions: number;
  sessionsToday: number;
  sessionsLast7Days: number;
}

const EMPTY_GAMES_PLAYED: GamesPlayedSummary = {
  totalSessions: 0,
  completedSessions: 0,
  inProgressSessions: 0,
  abandonedSessions: 0,
  sessionsToday: 0,
  sessionsLast7Days: 0,
};

/** Total play attempts broken down by session status, for the "Games Played" card. */
export async function getGamesPlayedSummary(): Promise<GamesPlayedSummary> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_games_played_summary");
  const row = data?.[0];
  if (!row) return EMPTY_GAMES_PLAYED;

  return {
    totalSessions: row.total_sessions,
    completedSessions: row.completed_sessions,
    inProgressSessions: row.in_progress_sessions,
    abandonedSessions: row.abandoned_sessions,
    sessionsToday: row.sessions_today,
    sessionsLast7Days: row.sessions_last_7_days,
  };
}

export interface AnswerAccuracySummary {
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyRate: number;
}

const EMPTY_ACCURACY: AnswerAccuracySummary = {
  correctAnswers: 0,
  incorrectAnswers: 0,
  accuracyRate: 0,
};

/** Correct vs incorrect counts across every question-based challenge ever answered. */
export async function getAnswerAccuracySummary(): Promise<AnswerAccuracySummary> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_answer_accuracy_summary");
  const row = data?.[0];
  if (!row) return EMPTY_ACCURACY;

  return {
    correctAnswers: row.correct_answers,
    incorrectAnswers: row.incorrect_answers,
    accuracyRate: row.accuracy_rate,
  };
}

export interface PrizeClaimSummary {
  totalWon: number;
  claimed: number;
  pending: number;
  expired: number;
  cancelled: number;
  claimRate: number;
}

const EMPTY_CLAIMS: PrizeClaimSummary = {
  totalWon: 0,
  claimed: 0,
  pending: 0,
  expired: 0,
  cancelled: 0,
  claimRate: 0,
};

/** winner_records broken down by status, plus the claim rate, for the "Prizes Claimed" card. */
export async function getPrizeClaimSummary(): Promise<PrizeClaimSummary> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_prize_claim_summary");
  const row = data?.[0];
  if (!row) return EMPTY_CLAIMS;

  return {
    totalWon: row.total_won,
    claimed: row.claimed,
    pending: row.pending,
    expired: row.expired,
    cancelled: row.cancelled,
    claimRate: row.claim_rate,
  };
}

export interface PrizeInventoryRow {
  prizeId: string;
  prizeName: string;
  prizeType: string;
  isActive: boolean;
  quantityTotal: number;
  quantityAwarded: number;
  quantityAvailable: number;
  lowStockThreshold: number;
}

/** One row per prize with full stock detail, lowest stock first. */
export async function getPrizeInventoryReport(): Promise<PrizeInventoryRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_prize_inventory_report");

  return (data ?? []).map((row) => ({
    prizeId: row.prize_id,
    prizeName: row.prize_name,
    prizeType: row.prize_type,
    isActive: row.is_active,
    quantityTotal: row.quantity_total,
    quantityAwarded: row.quantity_awarded,
    quantityAvailable: row.quantity_available,
    lowStockThreshold: row.low_stock_threshold,
  }));
}

export interface PopularGameRow {
  gameId: string;
  gameName: string;
  gameType: string;
  sessionsCount: number;
  winCount: number;
}

/** Every game ranked by total sessions played, for the "Most Popular Game" chart. */
export async function getMostPopularGames(limit = 10): Promise<PopularGameRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_most_popular_games", { p_limit: limit });

  return (data ?? []).map((row) => ({
    gameId: row.game_id,
    gameName: row.game_name,
    gameType: row.game_type,
    sessionsCount: row.sessions_count,
    winCount: row.win_count,
  }));
}

export interface DailyParticipationRow {
  /** ISO date string, e.g. "2026-07-11". */
  day: string;
  sessionsCount: number;
  completedCount: number;
  winnersCount: number;
}

/** One row per calendar day (default: trailing 30 days, zero-filled), for the "Daily Participation" chart. */
export async function getDailyParticipation(days = 30): Promise<DailyParticipationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_daily_participation", { p_days: days });

  return (data ?? []).map((row) => ({
    day: row.day,
    sessionsCount: row.sessions_count,
    completedCount: row.completed_count,
    winnersCount: row.winners_count,
  }));
}
