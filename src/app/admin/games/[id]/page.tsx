import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks, Eye } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getGameById, listGameLevelImages, listGameQuestions } from "@/lib/queries/games";
import { GameForm } from "@/components/admin/games/GameForm";
import { GameImagesManager } from "@/components/admin/games/GameImagesManager";
import { updateGameAction } from "@/lib/actions/games";

export const metadata: Metadata = {
  title: "Edit Game",
};

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/games/${id}`);

  const [game, images, questions] = await Promise.all([
    getGameById(id),
    listGameLevelImages(id),
    listGameQuestions(id),
  ]);

  if (!game) notFound();

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{game.name}</h1>
          <p className="text-muted-foreground">Edit details, manage images, and jump into questions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/games/${id}/questions`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ListChecks className="h-4 w-4" />
            Questions ({questions.length})
          </Link>
          <Link
            href={`/admin/games/${id}/preview`}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Details
        </h2>
        <GameForm game={game} onSubmit={(values) => updateGameAction(id, values)} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Images
        </h2>
        <GameImagesManager gameId={id} images={images} />
      </section>
    </div>
  );
}
