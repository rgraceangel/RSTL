"use client";

import { useContext } from "react";
import { SoundContext } from "@/components/providers/SoundProvider";

/** Access the mute flag + sound-effect dispatchers from within the `(play)` route tree. */
export function useSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
}
