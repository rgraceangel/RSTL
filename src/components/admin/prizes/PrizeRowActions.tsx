"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackagePlus, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { RoleGate } from "@/components/admin/RoleGate";
import {
  deletePrizeAction,
  restockPrizeAction,
  toggleAvailabilityAction,
} from "@/lib/actions/prizes";
import type { PrizeListItem } from "@/lib/queries/prizes";

export function PrizeRowActions({ prize }: { prize: PrizeListItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRestocking, setIsRestocking] = useState(false);
  const [restockAmount, setRestockAmount] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (next: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await toggleAvailabilityAction(prize.id, next);
      if (result?.error) setError(result.error);
      router.refresh();
    });
  };

  const handleRestock = () => {
    const amount = Number(restockAmount);
    if (!amount || amount <= 0) return;
    setError(null);
    startTransition(async () => {
      const result = await restockPrizeAction(prize.id, { amount });
      if (result?.error) {
        setError(result.error);
      } else {
        setIsRestocking(false);
        setRestockAmount("");
      }
      router.refresh();
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deletePrizeAction(prize.id);
      if (result?.error) {
        setError(result.error);
        setIsConfirmingDelete(false);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <RoleGate allowed={["admin", "super_admin"]} fallback={<span className="text-xs text-muted-foreground">View only</span>}>
          <Switch
            checked={prize.is_active}
            onCheckedChange={handleToggle}
            disabled={isPending}
            label="Toggle availability"
          />

          {isRestocking ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                className="h-8 w-20 px-2 text-xs"
                placeholder="Qty"
                autoFocus
              />
              <Button type="button" size="sm" disabled={isPending} onClick={handleRestock}>
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsRestocking(false);
                  setRestockAmount("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setIsRestocking(true)}
            >
              <PackagePlus className="h-3.5 w-3.5" />
              Restock
            </Button>
          )}

          <Link
            href={`/admin/prizes/${prize.id}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>

          {isConfirmingDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Delete?</span>
              <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={handleDelete}>
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-red-600 hover:bg-red-50"
              onClick={() => setIsConfirmingDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </RoleGate>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
