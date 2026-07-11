import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { getGameById } from "@/lib/queries/games";
import { CsvImportForm } from "@/components/admin/games/CsvImportForm";

export const metadata: Metadata = {
  title: "Bulk Import Questions",
};

interface ImportQuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ImportQuestionsPage({ params }: ImportQuestionsPageProps) {
  const { id } = await params;
  await requireRole(["admin", "super_admin"], `/admin/games/${id}/questions/import`);

  const game = await getGameById(id);
  if (!game) notFound();

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
        <h1 className="text-2xl font-semibold">Bulk Import Questions</h1>
        <p className="text-muted-foreground">{game.name} · upload a CSV file to add many questions at once.</p>
      </div>

      <CsvImportForm gameId={id} />
    </div>
  );
}
