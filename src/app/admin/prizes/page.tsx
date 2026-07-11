import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listPrizes } from "@/lib/queries/prizes";
import { PrizeTable } from "@/components/admin/prizes/PrizeTable";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { RoleGate } from "@/components/admin/RoleGate";

export const metadata: Metadata = {
  title: "Prizes",
};

interface PrizesPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function PrizesPage({ searchParams }: PrizesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.q ?? "";

  const { prizes, pageCount } = await listPrizes({ search, page });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prizes</h1>
          <p className="text-muted-foreground">Manage the prize catalog and stock levels.</p>
        </div>
        <RoleGate allowed={["admin", "super_admin"]}>
          <Link
            href="/admin/prizes/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Prize
          </Link>
        </RoleGate>
      </div>

      <SearchInput placeholder="Search prizes by name…" />

      <PrizeTable prizes={prizes} />

      <Pagination page={page} pageCount={pageCount} />
    </div>
  );
}
