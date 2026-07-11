"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AnswerRevealProps {
  correct: boolean;
  correctAnswerLabel: string;
  explanation: string | null;
  attemptsRemaining: number;
  /** Correct -> proceed to the Prize Wheel stage. */
  onContinue: () => void;
  /** Incorrect, attempts remain -> start a fresh session + question. */
  onTryAgain: () => void;
  /** Incorrect, no attempts remain -> leave the engine. */
  onExhausted: () => void;
}

/** "Reveal answer" + "You Got It"/"Try Again" + the stage's Navigation controls. */
export function AnswerReveal({
  correct,
  correctAnswerLabel,
  explanation,
  attemptsRemaining,
  onContinue,
  onTryAgain,
  onExhausted,
}: AnswerRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex w-full max-w-md flex-col items-center gap-5 text-center"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
          correct ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
        )}
      >
        {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        {correct ? "You Got It!" : "Try Again Next Time"}
      </div>

      <div className="w-full rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">Correct answer</p>
        <p className="mt-1 font-medium">{correctAnswerLabel}</p>
        {explanation && <p className="mt-2 text-sm text-muted-foreground">{explanation}</p>}
      </div>

      <div className="flex flex-col items-center gap-2">
        {correct ? (
          <Button onClick={onContinue} size="lg">
            Continue to Prize Wheel
          </Button>
        ) : attemptsRemaining > 0 ? (
          <Button onClick={onTryAgain} size="lg">
            Try Again Next Time ({attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} left)
          </Button>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">You&apos;re out of attempts for this game.</p>
            <Button onClick={onExhausted} variant="outline" size="lg">
              Back to Home
            </Button>
          </>
        )}
      </div>
    <