import { AlertTriangle } from "lucide-react";
import type { PrizeInventoryRow } from "@/lib/queries/analytics";

/**
 * Full per-prize stock report (`get_prize_inventory_report`, lowest stock
 * first). Deliberately its own table rather than reusing `PrizesTable`
 * (Admin > Prizes) -- that one is a CRUD list with row actions; this one is
 * a read-only report focused on the numbers a stock decision needs
 * (total/awarded/available at a glance), which is a different job even
 * though both read from `prizes`/`prize_inventory`.
 */
export function InventoryReportTable({ inventory }: { inventory: PrizeInventoryRow[] }) {
  if (inventory.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No prizes in the catalog yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Prize</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium text-right">Total</th>
            <th className="px-4 py-3 font-medium text-right">Awarded</th>
            <th className="px-4 py-3 font-medium text-right">Available</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {inventory.map((row) => {
            const outOfStock = row.quantityAvailable <= 0;
            const lowStock = !outOfStock && row.quantityAvailable <= row.lowStockThreshold;

            return (
              <tr key={row.prizeId}>
                <td className="px-4 py-3">
                  <p className="font-medium">{row.prizeName}</p>
                  {!row.isActive && <p className="text-xs text-muted-foreground">Inactive</p>}
                </td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{row.prizeType}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{row.quantityTotal}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{row.quantityAwarded}</td>
                <td className="px-4 py-3 text-right font-medium">{row.quantityAvailable}</td>
                <td className="px-4 py-3">
                  {outOfStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Out of stock
                    </span>
                  ) : lowStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <AlertTriangle className="h-3 w-3" /> Low stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      In stock
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
