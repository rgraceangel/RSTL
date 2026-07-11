import { type NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/auth/session";
import { listWinnerRecordsForExport } from "@/lib/queries/winners";
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

  const rows = winners.map((w) => ({
    "Player Name": w.player_name ?? "",
    "Player Contact": w.player_contact ?? "",
    Prize: w.prize_name,
    Game: w.game_name,
    Status: WINNER_STATUS_LABELS[w.status],
    "Won At": new Date(w.won_at).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Winners");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="winners-${Date.now()}.xlsx"`,
    },
  });
}
