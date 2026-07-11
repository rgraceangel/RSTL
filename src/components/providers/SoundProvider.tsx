"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { playErrorSound, playSpinStartSound, playTickSound, playWinSound } from "@/lib/sound";

const STORAGE_KEY = "sound-muted";

interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
  playSpinStart: () => void;
  playTick: () => void;
  playWin: () => void;
  playError: () => void;
}

export const SoundContext = createContext<SoundContextValue | null>(null);

/**
 * Global mute flag + synthesized sound-effect dispatch (`lib/sound.ts`),
 * scoped to the player experience per PROJECT_SPEC Section 15 ("No sound is
 * planned anywhere in the admin panel") -- mounted only in the `(play)`
 * route group layout, not the root layout. Mute preference persists to
 * `localStorage` (a real browser app, not a Claude-rendered artifact, so
 * this is the right tool here) so it survives a refresh or a "Spin Again".
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setMuted(true);
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((previous) => {
      const next = !previous;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value: SoundContextValue = {
    muted,
    toggleMuted,
    playSpinStart: () => {
      if (!muted) playSpinStartSound();
    },
    playTick: () => {
      if (!muted) playTickSound();
    },
    playWin: () => {
      if (!muted) playWinSound();
    },
    playError: () => {
      if (!muted) playErrorSound();
    },
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
