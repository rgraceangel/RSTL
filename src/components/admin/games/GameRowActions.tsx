"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Pencil, Trash2, ListChecks, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { RoleGate } from "@/components/admin/RoleGate";
import { toggleGameStatusAction, deleteGameAction } from "@/lib/actions/games";
import type { GameListItem } from "@/lib/queries/games";

const linkClass =
  "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function GameRowActions({ game }: { game: GameListItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canQuickToggle = game.status === "active" || game.status === "paused";

  const handleToggle = (next: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await toggleGameStatusAction(game.id, next);
      if (result?.error) setError(result.error);
      router.refresh();
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteGameAction(game.id);
      if (result?.error) {
        setError(result.error);
        setIsConfirmingDelete(false);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {canQuickToggle && (
          <RoleGate allowed={["admin", "super_admin"]} fallback={null}>
            <Switch
              checked={game.status === "active"}
              onCheckedChange={handleToggle}
              disabled={isPending}
              label="Toggle enabled"
            />
          </RoleGate>
        )}

        <Link href={`/admin/games/${game.id}/preview`} className={linkClass}>
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Link>

        <Link href={`/admin/games/${game.id}/questions`} className={linkClass}>
          <ListChecks className="h-3.5 w-3.5" />
          Questions ({game.question_count})
        </Link>

        <RoleGate allowed={["admin", "super_admin"]}>
          <Link href={`/admin/games/${game.id}`} className={linkClass}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>

          {isConfirmingDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Delete?</span>
              <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={handleDelete}>
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-red-600 hover:bg-red-50"
              onClick={() => setIsConfirmingDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </RoleGate>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
