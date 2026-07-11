"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAvailablePrizesForWheel } from "@/lib/queries/play";
import type { GameType } from "@/types";

/**
 * Player-facing game session + reward lifecycle, shared by every game type
 * the real Game Engine (Section 16b) supports. Unlike `lib/actions/*.ts`
 * elsewhere (all admin-only, gated by `requireRole`), these are
 * intentionally callable by anonymous players -- every trust decision here
 * is re-derived server-side from the database, never taken from a
 * client-supplied argument, since a tampered client could otherwise bypass
 * the attempt cap, force a specific prize, or claim someone else's win.
 */

export interface StartSessionSuccess {
  sessionId: string;
  attemptsRemaining: number;
}
export interface ActionFailure {
  error: string;
}

/**
 * Starts (or resumes identity for) a play session against `gameId`.
 * `gameType` is the type the *caller* expects to be starting (e.g. the
 * Game Engine passes whatever `games.game_type` it already rendered) --
 * this is re-checked against the database, not trusted, so a tampered
 * client can't start a session against a game of a different type/status
 * than what's actually live. Signs the visitor in anonymously via Supabase
 * Auth if they don't already have a session -- required because every
 * `game_sessions`/`winner_records` RLS policy is keyed off `auth.uid()`.
 */
export async function startGameSessionAction(
  gameId: string,
  gameType: GameType
): Promise<StartSessionSuccess | ActionFailure> {
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id, status, game_type, max_attempts_per_user")
    .eq("id", gameId)
    .maybeSingle();

  if (!game || game.status !== "active" || game.game_type !== gameType) {
    return { error: "This game is no longer available. Please refresh and try again." };
  }

  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) {
      return { error: "Could not start a session. Please refresh and try again." };
    }
    user = data.user;
  }

  const { count } = await supabase
    .from("game_sessions")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("player_id", user.id);

  const attemptsUsed = count ?? 0;
  if (attemptsUsed >= game.max_attempts_per_user) {
    return {
      error: `You've already used all ${game.max_attempts_per_user} attempt${
        game.max_attempts_per_user === 1 ? "" : "s"
      } for this game.`,
    };
  }

  const { data: session, error: sessionError } = await supabase
    .from("game_sessions")
    .insert({ game_id: gameId, player_id: user.id, status: "in_progress" })
    .select("id")
    .single();

  if (sessionError || !session) {
    return { error: "Could not start the game. Please try again." };
  }

  return { sessionId: session.id, attemptsRemaining: game.max_attempts_per_user - attemptsUsed - 1 };
}

export interface SpinSuccess {
  winnerRecordId: string;
  prizeId: string;
  prizeName: string;
}

/** Relative-weight random index pick; `weights` are already guaranteed positive by the caller. */
function pickWeightedIndex(weights: number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return i;
  }
  return weights.length - 1;
}

const MAX_STOCK_RACE_RETRIES = 3;

/**
 * Resolves the real, authoritative outcome of the Prize Wheel stage --
 * shared by every game type once a session has earned a shot at it (the
 * standalone Spin Wheel calls this immediately; the Quiz challenge calls it
 * only after a correct answer). Verifies the session belongs to the caller;
 * marks it completed *if it's still in progress* (the Quiz challenge marks
 * a losing session completed itself, so this is a no-op update in that
 * case -- see `lib/actions/quiz.ts#submitQuizAnswerAction`), then draws a
 * weighted-random prize from the *current* available pool (re-fetched
 * here, never trusted from the client) and records the win. The
 * `winner_records` insert is guarded by the `handle_prize_win()` trigger
 * (Section 4 / DATABASE.md), which atomically re-checks stock and raises if
 * the picked prize sold out in the split second between our read and this
 * insert -- on that specific race, this drops the prize and retries with
 * the remaining pool rather than failing the whole spin.
 */
export async function spinForPrizeAction(sessionId: string): Promise<SpinSuccess | ActionFailure> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session expired. Please refresh the page and try again." };
  }

  const { data: session } = await supabase
    .from("game_sessions")
    .select("id, player_id, status, game_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.player_id !== user.id) {
    return { error: "This session is no longer valid. Please refresh the page and try again." };
  }
  if (session.status !== "in_progress") {
    return { error: "This session has already been played." };
  }

  let pool = await getAvailablePrizesForWheel();
  if (pool.length === 0) {
    return { error: "No prizes are available right now. Please try again later." };
  }

  const { error: completeError } = await supabase
    .from("game_sessions")
    .update({ status: "completed" })
    .eq("id", sessionId)
    .eq("status", "in_progress");

  if (completeError) {
    return { error: "Could not finish the game. Please try again." };
  }

  for (let attempt = 0; attempt < MAX_STOCK_RACE_RETRIES && pool.length > 0; attempt++) {
    const index = pickWeightedIndex(pool.map((p) => Math.max(0.01, p.probability_weight)));
    const candidate = pool[index];

    const { data: winnerRecord, error: winError } = await supabase
      .from("winner_records")
      .insert({
        game_session_id: sessionId,
        game_id: session.game_id,
        prize_id: candidate.id,
      })
      .select("id")
      .single();

    if (!winError && winnerRecord) {
      revalidatePath("/play");
      return { winnerRecordId: winnerRecord.id, prizeId: candidate.id, prizeName: candidate.name };
    }

    if (winError?.message.includes("out of stock") || winError?.message.includes("No inventory record")) {
      pool = pool.filter((p) => p.id !== candidate.id);
      continue;
    }

    return { error: "Could not record your prize. Please contact support." };
  }

  return { error: "Every prize just sold out. Please try again in a moment." };
}

export type ClaimSuccess = { success: true };

/**
 * Lets a player attach their own contact info to their own pending win via
 * the `claim_prize_win` RPC (SECURITY DEFINER -- see the migration for why
 * this isn't a plain RLS UPDATE policy). Ownership, pending-status, and
 * required-fields checks all happen inside the RPC itself; this action is a
 * thin, typed wrapper plus friendlier error copy.
 */
export async function claimPrizeAction(
  winnerRecordId: string,
  playerName: string,
  playerContact: string
): Promise<ClaimSuccess | ActionFailure> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("claim_prize_win", {
    p_winner_record_id: winnerRecordId,
    p_player_name: playerName,
    p_player_contact: playerContact,
  });

  if (error) {
    if (error.message.includes("no longer claimable")) {
      return { error: "This prize has already been claimed." };
    }
    if (error.message.includes("Not authorized")) {
      return { error: "This prize doesn't belong to your session." };
    }
    return { error: "Could not save your claim. Please check your details and try again." };
  }

  revalidatePath("/admin/winners");
  return { success: true };
}
