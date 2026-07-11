"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  durationSeconds: number;
  onExpire: () => void;
  onTick?: (secondsRemaining: number) => void;
  paused?: boolean;
}

const LOW_TIME_THRESHOLD_SECONDS = 5;

/**
 * Reusable countdown -- one second per tick, a progress bar, and an
 * `onTick` callback so a caller can layer sound (`QuizChallenge` plays a
 * tick sound once the last few seconds start). Reset by remounting with a
 * new `key` (the standard React pattern), not an imperative reset prop --
 * `QuizChallenge` keys this on `question.id` so a new question always
 * starts a fresh countdown.
 */
export function CountdownTimer({ durationSeconds, onExpire, onTick, paused }: CountdownTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setSecondsRemaining((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    onTick?.(secondsRemaining);
    if (secondsRemaining === 0) {
      onExpire();
    }
    // onTick/onExpire are expected to be stable-enough callbacks from the parent;
    // re-running this effect should only be driven by the countdown value itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsRemaining]);

  const progress = Math.max(0, secondsRemaining / durationSeconds);
  const isLow = secondsRemaining <= LOW_TIME_THRESHOLD_SECONDS;

  return (
    <div className="w-full max-w-xs">
      <div className="mb-1 flex items-center justify-between text-sm font-medium">
        <span className="text-muted-foreground">Time left</span>
        <span className={cn("tabular-nums", isLow ? "text-red-600" : "text-foreground")}>{secondsRemaining}s</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", isLow ? "bg-red-500" : "bg-primary")}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>
    </div>
  );
}
