import { type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { listWinnerRecordsForExport } from "@/lib/queries/winners";
import { toCsv } from "@/lib/csv";
import { WINNER_STATUS_LABELS } from "@/constants";
import type { WinnerStatus } from "@/types";

export async function GET(request: NextRequest) {
  await requireAdmin("/admin/winners");

  const params = request.nextUrl.searchParams;
  const winners = await listWinnerRecordsForExport({
    search: params.get("q") ?? undefined,
    status: (params.get("status") as WinnerStatus) || "all",
    gameId: params.get("gameId") ?? undefined,
    prizeId: params.get("prizeId") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });

  const csv = toCsv(winners, [
    { header: "Player Name", accessor: (w) => w.player_name ?? "" },
    { header: "Player Contact", accessor: (w) => w.player_contact ?? "" },
    { header: "Prize", accessor: (w) => w.prize_name },
    { header: "Game", accessor: (w) => w.game_name },
    { header: "Status", accessor: (w) => WINNER_STATUS_LABELS[w.status] },
    { header: "Won At", accessor: (w) => new Date(w.won_at).toISOString() },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="winners-${Date.now()}.csv"`,
    },
  });
}
