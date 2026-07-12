import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getGameById } from "@/lib/queries/games";
import { QuestionForm } from "@/components/admin/games/QuestionForm";
import { createQuestionAction } from "@/lib/actions/game-questions";

export const metadata: Metadata = {
  title: "Add Question",
};

interface NewQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewQuestionPage({ params }: NewQuestionPageProps) {
  const { id } = await params;
  await requireRole(["admin", "super_admin"], `/admin/games/${id}/questions/new`);

  const game = await getGameById(id);
  if (!game) notFound();

  const config = (game.config ?? {}) as Record<string, unknown>;
  const defaultTimeLimit =
    typeof config.default_time_limit_seconds === "number" ? config.default_time_limit_seconds : 30;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/games/${id}/questions`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to questions
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">Add Question</h1>
        <p className="text-muted-foreground">{game.name}</p>
      </div>

      <QuestionForm
        defaultTimeLimitSeconds={defaultTimeLimit}
        onSubmit={createQuestionAction.bind(null, id)}
      />
    </div>
  );
}
