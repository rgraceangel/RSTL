"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CountdownTimer } from "@/components/play/CountdownTimer";
import { useSound } from "@/hooks/useSound";
import { parseQuizOptions } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import type { PublicQuizQuestion } from "@/lib/queries/play";

interface QuizChallengeProps {
  question: PublicQuizQuestion;
  onSubmit: (submittedAnswer: string) => void;
  submitting: boolean;
}

const LOW_TIME_THRESHOLD_SECONDS = 5;

/**
 * "Random question" + "Countdown timer" + "Countdown sound" + the answer
 * input itself. The actual correctness check happens server-side
 * (`submitQuizAnswerAction` -> `check_quiz_answer` RPC) -- this component
 * never sees `correct_answer`, only ever submits the player's choice.
 *
 * Shared by every question-based game type (Section 16c): when
 * `question.image_url` is set (Decoder's rebus image, Name It to Win It's
 * pictured item), it's rendered front-and-center above the prompt text --
 * for those types `question_text` is typically just a short instruction
 * ("Decode the image!") rather than the puzzle itself. `question.category`
 * (Name It to Win It's image grouping) renders as a small badge when set.
 */
export function QuizChallenge({ question, onSubmit, submitting }: QuizChallengeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const { playTick } = useSound();

  const options = parseQuizOptions(question.options);

  function handleExpire() {
    if (submitting) return;
    onSubmit(question.question_type === "text" ? textAnswer.trim() : selected ?? "");
  }

  function handleTick(secondsRemaining: number) {
    if (secondsRemaining > 0 && secondsRemaining <= LOW_TIME_THRESHOLD_SECONDS) {
      playTick();
    }
  }

  function handleManualSubmit() {
    if (submitting) return;
    if (question.question_type === "text") {
      if (textAnswer.trim().length > 0) onSubmit(textAnswer.trim());
    } else if (selected) {
      onSubmit(selected);
    }
  }

  const canSubmit = question.question_type === "text" ? textAnswer.trim().length > 0 : Boolean(selected);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <CountdownTimer
        key={question.id}
        durationSeconds={question.time_limit_seconds}
        onExpire={handleExpire}
        onTick={handleTick}
        paused={submitting}
      />

      {question.category && (
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {question.category}
        </span>
      )}

      {question.image_url && (
        <div className="relative h-56 w-full max-w-sm overflow-hidden rounded-lg border border-border bg-secondary/40">
          <Image
            src={question.image_url}
            alt="Guess the puzzle"
            fill
            className="object-contain"
            sizes="384px"
            priority
          />
        </div>
      )}

      <h2 className="text-center text-xl font-semibold">{question.question_text}</h2>

      {question.question_type === "multiple_choice" && (
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              disabled={submitting}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                selected === option.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
              )}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}

      {question.question_type === "true_false" && (
        <div className="grid w-full grid-cols-2 gap-3">
          {(["tr