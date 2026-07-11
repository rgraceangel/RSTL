"use server";

import { createClient } from "@/lib/supabase/server";
import { getRandomQuestionForGame, type PublicQuizQuestion } from "@/lib/queries/play";
import type { ActionFailure } from "@/lib/actions/game-sessions";

/**
 * Quiz-specific pieces of the Game Engine (Section 16b). Split from
 * `game-sessions.ts` (which stays generic across every game type) since
 * these two actions only make sense for `game_type = 'quiz'`.
 */

/**
 * Thin, client-callable wrapper around `getRandomQuestionForGame()`. Plain
 * `server-only` query functions can't be called directly from a Client
 * Component (that's exactly what `server-only` prevents) -- a Server
 * Action is the mechanism for a client-triggered read, which the Game
 * Engine needs for "Try Again" (a fresh random question without a full
 * page navigation).
 */
export async function getRandomQuestionAction(gameId: string): Promise<PublicQuizQuestion | ActionFailure> {
  const question = await getRandomQuestionForGame(gameId);
  if (!question) {
    return { error: "No questions are available for this game right now." };
  }
  return question;
}

export interface QuizAnswerResult {
  correct: boolean;
  correctAnswer: string;
  explanation: string | null;
  pointsAwarded: number;
}

/**
 * Submits a player's answer for one question. Verifies the session belongs
 * to the caller and is still in progress, then defers the actual check to
 * the `check_quiz_answer` RPC (SECURITY DEFINER -- `game_questions.
 * correct_answer` is admin-only via RLS, so this can't be a plain
 * `.select()`). On an incorrect answer, marks the session `completed`
 * itself (score 0) since there's no reward stage to follow; on a correct
 * answer, deliberately leaves `status` as `in_progress` so the *existing*
 * `spinForPrizeAction` (unmodified, already generic) is the one thing that
 * transitions it to `completed` when the Prize Wheel stage resolves --
 * this avoids two different places racing to "finish" the same session.
 * Either way, `answer_correct` (Section 17 / Analytics) is stamped
 * immediately so admin reporting can count correct vs incorrect answers
 * without waiting for -- or requiring -- the Prize Wheel stage to resolve.
 */
export async function submitQuizAnswerAction(
  sessionId: string,
  questionId: string,
  submittedAnswer: string
): Promise<QuizAnswerResult | ActionFailure> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session expired. Please refresh the page and try again." };
  }

  const { data: session } = await supabase
    .from("game_sessions")
    .select("id, player_id, status")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.player_id !== user.id) {
    return { error: "This session is no longer valid. Please refresh the page and try again." };
  }
  if (session.status !== "in_progress") {
    return { error: "This question has already been answered." };
  }

  const { data, error } = await supabase.rpc("check_quiz_answer", {
    p_question_id: questionId,
    p_submitted_answer: submittedAnswer,
  });

  const result = data?.[0];
  if (error || !result) {
    return { error: "Could not check your answer. Please try again." };
  }

  if (!result.is_correct) {
    await supabase
      .from("game_sessions")
      .update({ status: "completed", score: 0, answer_correct: false })
      .eq("id",