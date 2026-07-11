"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Ban, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RoleGate } from "@/components/admin/RoleGate";
import { markClaimedAction, cancelWinAction, deleteWinnerAction } from "@/lib/actions/winners";
import type { WinnerListItem } from "@/lib/queries/winners";

export function WinnerRowActions({ winner }: { winner: WinnerListItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error?: string } | void>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result?.error) setError(result.error);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/winners/${winner.id}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>

        <RoleGate allowed={["admin", "super_admin"]}>
          {winner.status === "pending" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={isPending}
              onClick={() => run(() => markClaimedAction(winner.id))}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Mark claimed
            </Button>
          )}

          {(winner.status === "pending" || winner.status === "claimed") && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-red-600 hover:bg-red-50"
              disabled={isPending}
              onClick={() => run(() => cancelWinAction(winner.id))}
            >
              <Ban className="h-3.5 w-3.5" />
              Cancel
            </Button>
          )}

          {isConfirmingDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Delete?</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => run(() => deleteWinnerAction(winner.id))}
              >
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
