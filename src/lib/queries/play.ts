import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GameType, PrizeType, QuestionType, Json } from "@/types";

/**
 * Anonymous-safe reads backing the real player experience (`/play`,
 * `components/play/GameEngine.tsx`). Distinct from `queries/public.ts`
 * (which only feeds the marketing homepage's decorative preview wheels):
 * everything here is consumed by server actions that make real, stock- or
 * session-affecting decisions, not just display copy.
 */

export interface PlayableGame {
  id: string;
  name: string;
  slug: string;
  game_type: GameType;
  description: string | null;
  max_attempts_per_user: number;
}

/**
 * Picks one random, currently-playable game whose `game_type` is in
 * `gameTypes`. "Currently playable" = `status = 'active'` (public RLS
 * already limits reads to this) AND, if set, within the game's
 * `start_date`/`end_date` window -- the exact lookup DATABASE.md's
 * `games (status, start_date, end_date)` composite index was built for.
 * Live promotions are expected to be a small set, so picking randomly in
 * application code after fetching all candidates is simpler than
 * PostgREST's query builder (which has no `order by random()`) and just as
 * fair. Defaults to every game type the Game Engine (Section
 * 16b/16c/16d/16e/16f/16g) actually knows how to run.
 */
export async function getRandomActiveGame(
  gameTypes: readonly GameType[] = [
    "quiz",
    "spin_wheel",
    "decoder",
    "guess_the_gibberish",
    "name_it_to_win_it",
    "logo_challenge",
    "chemical_symbol_challenge",
    "true_or_false",
    "guess_the_unit",
    "measurement_challenge",
    "equipment_match",
    "which_laboratory",
    "hazard_symbol",
    "odd_one_out",
    "word_scramble",
    "emoji_science",
    "picture_puzzle",
    "memory_challenge",
    "spot_the_difference",
    "ppe_challenge",
    "calibration_challenge",
    "science_bingo",
    "science_facts",
    "mini_crossword",
    "wheel_of_science_facts",
  ]
): Promise<PlayableGame | null> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data } = await supabase
    .from("games")
    .select("id, name, slug, game_type, description, max_attempts_per_user")
    .eq("status", "active")
    .in("game_type", gameTypes as GameType[])
    .or(`start_date.is.null,start_date.lte.${nowIso}`)
    .or(`end_date.is.null,end_date.gte.${nowIso}`);

  const candidates = data ?? [];
  if (candidates.length === 0) return null;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export interface AvailableWheelPrize {
  id: string;
  name: string;
  prize_type: PrizeType;
  probability_weight: number;
}

/**
 * Active, in-stock prizes via the `available_prizes_for_wheel` view --
 * never reads `prize_inventory` directly (admin-only RLS). Used both to
 * render the Prize Wheel's segments and, inside `spinForPrizeAction`, as
 * the authoritative draw pool re-fetched fresh at spin time.
 */
export async function getAvailablePrizesForWheel(limit = 8): Promise<AvailableWheelPrize[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("available_prizes_for_wheel")
    .select("id, name, prize_type, probability_weight")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export interface PublicQuizQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: Json;
  points: number;
  time_limit_seconds: number;
  category: string | null;
  image_url: string | null;
}

/**
 * One random question for `gameId`, read from `game_questions_public` --
 * never the raw `game_questions` table, which is admin-only precisely
 * because it carries `correct_answer`. Answer checking happens entirely
 * server-side via the `check_quiz_answer` RPC (`lib/actions/quiz.ts`), so
 * this function never needs to (and structurally cannot) see the answer
 * key either. `image_url` (from `game_images` via the view) and `category`
 * are what let Decoder/Name It to Win It render an image-driven challenge
 * through the exact same `QuizChallenge` component as a text quiz.
 */
export async function getRandomQuestionForGame(gameId: string): Promise<PublicQuizQuestion | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_questions_public")
    .select("id, question_text, question_type, options, points, time_limit_seconds, category, image_url")
    .eq("game_id", gameId);

  const rows = data ?? [];
  if (rows.length === 0) return null;

  return rows[Math.floor(Math.random() * rows.length)];
}
