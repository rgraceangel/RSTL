import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getGameById, listGameQuestionsForPreview } from "@/lib/queries/games";
import { GamePreview } from "@/components/admin/games/GamePreview";

export const metadata: Metadata = {
  title: "Preview Game",
};

interface PreviewGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewGamePage({ params }: PreviewGamePageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/games/${id}/preview`);

  const [game, questions] = await Promise.all([getGameById(id), listGameQuestionsForPreview(id)]);
  if (!game) notFound();

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

      <GamePreview game={game} questions={questions} />
    </div>
  );
}
