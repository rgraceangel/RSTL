import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listWinnerRecords, getGameOptions, getActivePrizeOptions } from "@/lib/queries/winners";
import { WinnersTable } from "@/components/admin/winners/WinnersTable";
import { WinnerFilters } from "@/components/admin/winners/WinnerFilters";
import { ExportButtons } from "@/components/admin/winners/ExportButtons";
import { Pagination } from "@/components/admin/Pagination";
import { RoleGate } from "@/components/admin/RoleGate";
import type { WinnerStatus } from "@/types";

export const metadata: Metadata = {
  title: "Winners",
};

interface WinnersPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    gameId?: string;
    prizeId?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function WinnersPage({ searchParams }: WinnersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ winners, pageCount }, games, prizes] = await Promise.all([
    listWinnerRecords({
      search: params.q,
      status: (params.status as WinnerStatus) || "all",
      gameId: params.gameId,
      prizeId: params.prizeId,
      from: params.from,
      to: params.to,
      page,
    }),
    getGameOptions(),
    getActivePrizeOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="hidden print:block">
        <h1 className="text-xl font-semibold">Winners Report</h1>
        <p className="text-sm text-muted-foreground">
          Generated {new Date().toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-semibold">Winners</h1>
          <p className="text-muted-foreground">Track and manage recorded prize wins.</p>
        </div>
        <RoleGate allowed={["admin", "super_admin"]}>
          <Link
            href="/admin/winners/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Record Win
          </Link>
        </RoleGate>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <WinnerFilters games={games} prizes={prizes} />
        <ExportButtons />
      </div>

      <WinnersTable winners={winners} />

      <div className="print:hidden">
        <Pagination page={page} pageCount={pageCount} />
      </div>
    </div>
  );
}
