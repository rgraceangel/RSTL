import { WinnerRowActions } from "@/components/admin/winners/WinnerRowActions";
import { WINNER_STATUS_LABELS, WINNER_STATUS_STYLES } from "@/constants";
import { cn } from "@/lib/utils";
import type { WinnerListItem } from "@/lib/queries/winners";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function WinnersTable({ winners }: { winners: WinnerListItem[] }) {
  if (winners.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No winners found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="print:hidden">
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">Prize</th>
            <th className="px-4 py-3 font-medium">Game</th>
            <th className="px-4 py-3 font-medium">Won</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td className="px-4 py-3">
                <p className="font-medium">{winner.player_name ?? "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">{winner.player_contact ?? "—"}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{winner.prize_name}</td>
              <td className="px-4 py-3 text-muted-foreground">{winner.game_name}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(winner.won_at)}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    WINNER_STATUS_STYLES[winner.status]
                  )}
                >
                  {WINNER_STATUS_LABELS[winner.status]}
                </span>
              </td>
              <td className="px-4 py-3 print:hidden">
                <WinnerRowActions winner={winner} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
