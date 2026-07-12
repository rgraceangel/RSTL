import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { GameForm } from "@/components/admin/games/GameForm";
import { createGameAction } from "@/lib/actions/games";

export const metadata: Metadata = {
  title: "New Game",
};

export default async function NewGamePage() {
  await requireRole(["admin", "super_admin"], "/admin/games/new");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Game</h1>
        <p className="text-muted-foreground">
          Set up the game's basic info. You can add questions and images once it's created.
        </p>
      </div>

      <GameForm onSubmit={createGameAction} />
    </div>
  );
}
