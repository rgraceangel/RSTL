import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listGames } from "@/lib/queries/games";
import { GamesTable } from "@/components/admin/games/GamesTable";
import { GameStatusFilter } from "@/components/admin/games/GameStatusFilter";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { RoleGate } from "@/components/admin/RoleGate";
import type { GameStatus } from "@/types";

export const metadata: Metadata = {
  title: "Games",
};

interface GamesPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { games, pageCount } = await listGames({
    search: params.q,
    status: (params.status as GameStatus) || "all",
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Games</h1>
          <p className="text-muted-foreground">Manage games, timers, questions, and images.</p>
        </div>
        <RoleGate allowed={["admin", "super_admin"]}>
          <Link
            href="/admin/games/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Game
          </Link>
        </RoleGate>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search games by name…" />
        <GameStatusFilter />
      </div>

      <GamesTable games={games} />

      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}
