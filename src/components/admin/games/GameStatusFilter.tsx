"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { GAME_STATUS_LABELS } from "@/constants";
import { GAME_STATUSES } from "@/lib/validations/game";

export function GameStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setStatus = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      className="w-auto"
      value={searchParams.get("status") ?? "all"}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="all">All statuses</option>
      {GAME_STATUSES.map((status) => (
        <option key={status} value={status}>
          {GAME_STATUS_LABELS[status]}
        </option>
      ))}
    </Select>
  );
}
