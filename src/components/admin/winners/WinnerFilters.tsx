"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/admin/SearchInput";
import { WINNER_STATUSES } from "@/lib/validations/winner";
import { WINNER_STATUS_LABELS } from "@/constants";
import type { OptionItem } from "@/lib/queries/winners";

interface WinnerFiltersProps {
  games: OptionItem[];
  prizes: OptionItem[];
}

export function WinnerFilters({ games, prizes }: WinnerFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden">
      <SearchInput placeholder="Search by player name or contact…" />

      <Select
        className="w-auto"
        value={searchParams.get("status") ?? "all"}
        onChange={(e) => setParam("status", e.target.value === "all" ? "" : e.target.value)}
      >
        <option value="all">All statuses</option>
        {WINNER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {WINNER_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>

      <Select
        className="w-auto"
        value={searchParams.get("gameId") ?? ""}
        onChange={(e) => setParam("gameId", e.target.value)}
      >
        <option value="">All games</option>
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.label}
          </option>
        ))}
      </Select>

      <Select
        className="w-auto"
        value={searchParams.get("prizeId") ?? ""}
        onChange={(e) => setParam("prizeId", e.target.value)}
      >
        <option value="">All prizes</option>
        {prizes.map((prize) => (
          <option key={prize.id} value={prize.id}>
            {prize.label}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>From</span>
        <Input
          type="date"
          className="h-9 w-auto"
          value={searchParams.get("from") ?? ""}
          onChange={(e) => setParam("from", e.target.value)}
        />
        <span>to</span>
        <Input
          type="date"
          className="h-9 w-auto"
          value={searchParams.get("to") ?? ""}
          onChange={(e) => setParam("to", e.target.value)}
        />
      </div>
    </div>
  );
}
