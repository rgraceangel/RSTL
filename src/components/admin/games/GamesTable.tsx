import Image from "next/image";
import { ImageOff } from "lucide-react";
import { GameRowActions } from "@/components/admin/games/GameRowActions";
import { GAME_TYPE_LABELS, GAME_STATUS_LABELS, GAME_STATUS_STYLES } from "@/constants";
import { cn } from "@/lib/utils";
import type { GameListItem } from "@/lib/queries/games";

export function GamesTable({ games }: { games: GameListItem[] }) {
  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No games found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Game</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Images</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {games.map((game) => (
            <tr key={game.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    {game.thumbnail_url ? (
                      <Image
                        src={game.thumbnail_url}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <p className="text-xs text-muted-foreground">/{game.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{GAME_TYPE_LABELS[game.game_type]}</td>
              <td className="px-4 py-3 text-muted-foreground">{game.image_count}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    GAME_STATUS_STYLES[game.status]
                  )}
                >
                  {GAME_STATUS_LABELS[game.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <GameRowActions game={game} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
