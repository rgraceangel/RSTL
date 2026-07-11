"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { GameIntro } from "@/components/play/GameIntro";
import { QuizChallenge } from "@/components/play/QuizChallenge";
import { AnswerReveal } from "@/components/play/AnswerReveal";
import { PrizeStage } from "@/components/play/PrizeStage";
import { ClaimForm } from "@/components/play/ClaimForm";
import { ThankYouScreen } from "@/components/play/ThankYouScreen";
import { useSound } from "@/hooks/useSound";
import { startGameSessionAction } from "@/lib/actions/game-sessions";
import { getRandomQuestionAction, submitQuizAnswerAction } from "@/lib/actions/quiz";
import { describeQuizAnswer } from "@/lib/quiz";
import type { PlayableGame, PublicQuizQuestion } from "@/lib/queries/play";
import type { WheelSegment } from "@/types";

interface GameEngineProps {
  game: PlayableGame;
  prizeSegments: WheelSegment[];
}

type Stage =
  | "intro"
  | "loading"
  | "challenge"
  | "reveal"
  | "prize"
  | "claim"
  | "thanks"
  | "unsupported"
  | "error"
  | "exhausted";

interface QuizResult {
  correct: boolean;
  correctAnswerLabel: string;
  explanation: string | null;
}

interface WonPrize {
  winnerRecordId: string;
  prizeName: string;
}

/**
 * Every game type that runs a "random question + countdown timer + reveal"
 * challenge before the Prize Wheel -- mechanically identical regardless of
 * whether the prompt is plain text (`quiz`, `chemical_symbol_challenge`,
 * `true_or_false`, `guess_the_unit`, `measurement_challenge`), an image to
 * decode (`decoder`), a phonetic phrase (`guess_the_gibberish`), or a timed
 * image to name (`name_it_to_win_it`, `logo_challenge`): one
 * `game_questions` row (any `question_type`), checked by the same
 * `check_quiz_answer` RPC. `spin_wheel` is the only supported type with no
 * separate challenge stage.
 */
const QUESTION_BASED_TYPES = new Set([
  "quiz",
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
]);
const SUPPORTED_TYPES = new Set([...QUESTION_BASED_TYPES, "spin_wheel"]);

/**
 * The one reusable Game Engine every playable game runs through --
 * Title -> Mechanics -> Start -> [challenge, if the type has one] ->
 * Reveal -> Prize Wheel -> Claim -> Thank You. Every type in
 * `QUESTION_BASED_TYPES` (24 of them as of Section 16g) runs the full
 * challenge (random question/image, countdown timer + sound, reveal
 * answer) through the exact same `QuizChallenge` component (name kept from
 * when only `quiz` used it -- it's now the shared question-based challenge
 * stage for all of them, differing only in `question_type`
 * multiple_choice/true_false/text and whether a per-question image is
 * attached); `spin_wheel` has no separate challenge -- the wheel spin
 * itself is both the challenge and the reward.
 * `claw_machine`/`scratch_card`/`slot_machine` show an honest "not built
 * yet" state rather than a fake mechanic.
 */
export function GameEngine({ game, prizeSegments }: GameEngineProps) {
  const [stage, setStage] = useState<Stage>(SUPPORTED_TYPES.has(game.game_type) ? "intro" : "unsupported");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [question, setQuestion] = useState<PublicQuizQuestion | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [wonPrize, setWonPrize] = useState<WonPrize | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const { playError } = useSound();

  async function handleStart() {
    setStage("loading");
    setErrorMessage(null);
    setQuizResult(null);

    const sessionResult = await startGameSessionAction(game.id, game.game_type);
    if ("error" in sessionResult) {
      setErrorMessage(sessionResult.error);
      setStage(sessionResult.error.toLowerCase().includes("already used all") ? "exhausted" : "error");
      playError();
      return;
    }

    setSessionId(sessionResult.sessionId);
    setAttemptsRemaining(sessionResult.attemptsRemaining);

    if (QUESTION_BASED_TYPES.has(game.game_type)) {
      const questionResult = await getRandomQuestionAction(game.id);
      if ("error" in questionResult) {
        setErrorMessage(questionResult.error);
        setStage("error");
        playError();
        return;
      }
      setQuestion(questionResult);
      setStage("challenge");
      return;
    }

    // spin_wheel: no separate challenge -- straight to the Prize Wheel.
    setStage("prize");
  }

  async function handleQuizSubmit(submittedAnswer: string) {
    if (!sessionId || !question || submittingAnswer) return;
    setSubmittingAnswer(true);

    const result = await submitQuizAnswerAction(sessionId, question.id, submittedAnswer);
    setSubmittingAnswer(false);

    if ("error" in result) {
      setErrorMessage(result.error);
      setStage("error");
      playError();
      return;
    }

    setQuizResult({
      correct: result.correct,
      correctAnswerLabel: describeQuizAnswer(question, result.correctAnswer),
      explanation: result.explanation,
    });
    setStage("reveal");
  }

  function handleWon(winnerRecordId: string, prizeName: string) {
    setWonPrize({ winnerRecordId, prizeName });
    setStage("claim");
  }

  function handlePlayAgain() {
    setSessionId(null);
    setAttemptsRemaining(null);
    setQuestion(null);
    setQuizResult(null);
    setWonPrize(null);
    setErrorMessage(null);
    setStage("intro");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {stage === "unsupported" && (
          <motion.div
            key="unsupported"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <h1 className="text-2xl font-semibold">{game.name}</h1>
            <p className="max-w-md text-muted-foreground">
              This game type doesn&apos;t have a player experience built yet -- check back soon.
            </p>
          </motion.div>
        )}

        {(stage === "intro" || stage === "loading") && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameIntro game={game} onStart={handleStart} starting={stage === "loading"} />
          </motion.div>
        )}

        {stage === "challenge" && question && (
          <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizChallenge question={question} onSubmit={handleQuizSubmit} submitting={submittingAnswer} />
          </motion.div>
        )}

        {stage === "reveal" && quizResult && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnswerReveal
              correct={quizResult.correct}
              correctAnswerLabel={quizResult.correctAnswerLabel}
              explanation={quizResult.explanation}
              attemptsRemaining={attemptsRemaining ?? 0}
              onContinue={() => setStage("prize")}
              onTryAgain={handleStart}
              onExhausted={() => setStage("exhausted")}
            />
          </motion.div>
        )}

        {stage === "prize" && sessionId && (
          <motion.div key="prize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrizeStage sessionId={sessionId} segments={prizeSegments} onWon={handleWon} />
          </motion.div>
        )}

        {stage === "claim" && wonPrize && (
          <motion.div key="claim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClaimForm
              winnerRecordId={wonPrize.winnerRecordId}
              prizeName={wonPrize.prizeName}
              onClaimed={() => setStage("thanks")}
            />
          </motion.div>
        )}

        {stage === "thanks" && wonPrize && (
          <motion.div key="thanks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ThankYouScreen prizeName={wonPrize.prizeName} onPlayAgain={handlePlayAgain} />
          </motion.div>
        )}

        {(stage === "error" || stage === "exhausted") && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div
              className={
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium " +
                (stage === "exhausted" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600")
              }
            >
              <XCircle className="h-4 w-4" />
              {errorMessage ?? "Something went wrong."}
            </div>
            <Link href="/" className="text-sm font-medium text-primary underline underline-offset-4">
              Back to home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
