"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GAME_TYPE_LABELS, GAME_TYPE_MECHANICS_COPY } from "@/constants";
import type { PlayableGame } from "@/lib/queries/play";

interface GameIntroProps {
  game: PlayableGame;
  onStart: () => void;
  starting: boolean;
}

/** Title + Mechanics + Start button -- the entry stage of the Game Engine. */
export function GameIntro({ game, onStart, starting }: GameIntroProps) {
  const mechanics = game.description?.trim() || GAME_TYPE_MECHANICS_COPY[game.game_type];

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {GAME_TYPE_LABELS[game.game_type]}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{game.name}</h1>
      </div>

      <p className="max-w-md text-muted-foreground">{mechanics}</p>

      <Button onClick={onStart} disabled={starting} size="lg" className="gap-2">
        <Play className="h-4 w-4" />
        {starting ? "Getting ready..." : "Start"}
      </Button>
    </div>
  );
}
