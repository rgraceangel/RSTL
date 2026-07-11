import Image from "next/image";
import { ImageOff } from "lucide-react";
import { PrizeRowActions } from "@/components/admin/prizes/PrizeRowActions";
import { PRIZE_TYPE_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import type { PrizeListItem } from "@/lib/queries/prizes";

export function PrizeTable({ prizes }: { prizes: PrizeListItem[] }) {
  if (prizes.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No prizes found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Prize</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Value</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {prizes.map((prize) => {
            const isLowStock =
              prize.quantity_available > 0 && prize.quantity_available <= prize.low_stock_threshold;
            const isOutOfStock = prize.quantity_available <= 0;

            return (
              <tr key={prize.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {prize.image_url ? (
                        <Image
                          src={prize.image_url}
                          alt={prize.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{prize.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {PRIZE_TYPE_LABELS[prize.prize_type]}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {prize.value.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-medium",
                      isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : ""
                    )}
                  >
                    {prize.quantity_available}
                  </span>
                  <span className="text-muted-foreground"> / {prize.quantity_total}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      prize.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {prize.is_active ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PrizeRowActions prize={prize} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
