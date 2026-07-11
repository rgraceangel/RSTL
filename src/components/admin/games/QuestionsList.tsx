"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RoleGate } from "@/components/admin/RoleGate";
import { moveQuestionAction, deleteQuestionAction } from "@/lib/actions/game-questions";
import { QUESTION_TYPE_LABELS } from "@/constants";
import type { GameQuestionListItem } from "@/lib/queries/games";

export function QuestionsList({ gameId, questions }: { gameId: string; questions: GameQuestionListItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMove = (questionId: string, direction: "up" | "down") => {
    setError(null);
    startTransition(async () => {
      const result = await moveQuestionAction(gameId, questionId, direction);
      if (result?.error) setError(result.error);
      router.refresh();
    });
  };

  const handleDelete = (questionId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteQuestionAction(gameId, questionId);
      if (result?.error) {
        setError(result.error);
        setConfirmingId(null);
      } else {
        router.refresh();
      }
    });
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No questions yet. Add one, or bulk import from a CSV file.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <ol className="space-y-2">
        {questions.map((question, index) => (
          <li
            key={question.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{question.question_text}</p>
                <p className="text-xs text-muted-foreground">
                  {QUESTION_TYPE_LABELS[question.question_type]} · {question.points} pts ·{" "}
                  {question.time_limit_seconds}s
                  {question.category && <> · {question.category}</>}
                  {question.has_image && (
                    <span className="ml-1 inline-flex items-center gap-0.5">
                      · <ImageIcon className="h-3 w-3" />
                    </span>
                  )}
                </p>
              </div>
            </div>

            <RoleGate allowed={["admin", "super_admin"]}>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={isPending || index === 0}
                  onClick={() => handleMove(question.id, "up")}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isPending || index === questions.length - 1}
                  onClick={() => handleMove(question.id, "down")}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>

                <Link
                  href={`/admin/games/${gameId}/questions/${question.id}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>

                {confirmingId === question.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Delete?</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleDelete(question.id)}
                    >
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-red-600 hover:bg-red-50"
                    onClick={() => setConfirmingId(question.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                )}
              </div>
            </RoleGate>
          </li>
        ))}
      </ol>
    </div>
  );
}
