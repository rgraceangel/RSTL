import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Upload, ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getGameById, listGameQuestions } from "@/lib/queries/games";
import { QuestionsList } from "@/components/admin/games/QuestionsList";
import { RoleGate } from "@/components/admin/RoleGate";

export const metadata: Metadata = {
  title: "Questions",
};

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/games/${id}/questions`);

  const game = await getGameById(id);
  if (!game) notFound();

  const questions = await listGameQuestions(id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/games/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {game.name}
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Questions</h1>
          <p className="text-muted-foreground">{game.name} · {questions.length} question(s)</p>
        </div>
        <RoleGate allowed={["admin", "super_admin"]}>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/games/${id}/questions/import`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Upload className="h-4 w-4" />
              Bulk Import (CSV)
            </Link>
            <Link
              href={`/admin/games/${id}/questions/new`}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </RoleGate>
      </div>

      <QuestionsList gameId={id} questions={questions} />
    </div>
  );
}
