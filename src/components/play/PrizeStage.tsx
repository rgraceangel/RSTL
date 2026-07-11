"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, PartyPopper, RotateCw, XCircle } from "lucide-react";
import { Wheel } from "@/components/ui/Wheel";
import { Button } from "@/components/ui/Button";
import { useSound } from "@/hooks/useSound";
import { spinForPrizeAction } from "@/lib/actions/game-sessions";
import { computeSpinRotation, scheduleSpinTicks, WHEEL_SPIN_DURATION_MS } from "@/lib/wheel";
import { cn } from "@/lib/utils";
import type { WheelSegment } from "@/types";

interface PrizeStageProps {
  sessionId: string;
  segments: WheelSegment[];
  onWon: (winnerRecordId: string, prizeName: string) => void;
}

type SpinPhase = "idle" | "spinning" | "result" | "error";

/**
 * The "Prize wheel" stage -- reached after a successful challenge (or
 * immediately for spin_wheel games, which have no separate challenge).
 * Reuses the exact same `Wheel` primitive, spin math (`lib/wheel.ts`), and
 * `spinForPrizeAction` as the standalone Spin Wheel (`SpinWheelGame.tsx`,
 * now superseded) -- only the surrounding orchestration differs, since here
 * there's no "attempts"/"play again" concept: one challenge win earns
 * exactly one spin.
 */
export function PrizeStage({ sessionId, segments, onWon }: PrizeStageProps) {
  const [phase, setPhase] = useState<SpinPhase>("idle");
  const [rotation, setRotation] = useState(0);
  const [wonPrizeLabel, setWonPrizeLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pendingWin = useRef<{ winnerRecordId: string; prizeName: string } | null>(null);
  const cancelTicksRef = useRef<(() => void) | null>(null);

  const { playSpinStart, playTick, playWin, playError } = useSound();

  async function spin() {
    if (phase === "spinning") return;

    setPhase("spinning");
    playSpinStart();

    const result = await spinForPrizeAction(sessionId);

    if ("error" in result) {
      setErrorMessage(result.error);
      setPhase("error");
      playError();
      return;
    }

    const targetIndex = segments.findIndex((segment) => segment.id === result.prizeId);
    const safeIndex = targetIndex === -1 ? 0 : targetIndex;
    const segmentAngle = 360 / segments.length;
    const nextRotation = computeSpinRotation(rotation, segments.length, safeIndex);
    const delta = nextRotation - rotation;

    cancelTicksRef.current?.();
    cancelTicksRef.current = scheduleSpinTicks(delta, segmentAngle, WHEEL_SPIN_DURATION_MS, playTick);

    pendingWin.current = { winnerRecordId: result.winnerRecordId, prizeName: result.prizeName };
    setRotation(nextRotation);
  }

  function handleSettled() {
    setPhase("result");
    setWonPrizeLabel(pendingWin.current?.prizeName ?? null);
    playWin();
  }

  function handleContinue() {
    if (pendingWin.current) {
      onWon(pendingWin.current.winnerRecordId, pendingWin.current.prizeName);
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Bonus Round</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Spin the Prize Wheel</h2>
      </div>

      <Wheel segments={segments} rotation={rotation} onSettled={handleSettled} hub={<Gift className="h-6 w-6 text-primary" />} />

      {phase === "error" ? (
        <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600">
          <XCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      ) : phase === "result" && wonPrizeLabel ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <PartyPopper className="h-4 w-4" />
              You won: {wonPrizeLabel}!
            </div>
            <Button onClick={handleContinue} size="lg">
              Continue to Claim Your Prize
            </Button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <Button onClick={spin} disabled={phase === "spinning"} size="lg" className="gap-2">
          <RotateCw className={cn("h-4 w-4", phase === "spinning" && "animate-spin")} />
          {phase === "spinning" ? "Spinning..." : "Spin the Prize Wheel"}
        </Button>
      )}
    </div>
  );
}
