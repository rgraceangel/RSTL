"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { winnerUpdateSchema, WINNER_STATUSES, type WinnerUpdateFormValues } from "@/lib/validations/winner";
import { updateWinnerAction } from "@/lib/actions/winners";
import { WINNER_STATUS_LABELS } from "@/constants";
import type { WinnerDetail } from "@/lib/queries/winners";

export function WinnerEditForm({ winner }: { winner: WinnerDetail }) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [savedMessage, setSavedMessage] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WinnerUpdateFormValues>({
    resolver: zodResolver(winnerUpdateSchema),
    defaultValues: {
      player_name: winner.player_name ?? "",
      player_contact: winner.player_contact ?? "",
      status: winner.status,
    },
  });

  const submit = (values: WinnerUpdateFormValues) => {
    setServerError(undefined);
    setSavedMessage(undefined);
    startTransition(async () => {
      const result = await updateWinnerAction(winner.id, values);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setSavedMessage("Changes saved.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-xl space-y-6" noValidate>
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}
      {savedMessage && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="player_name">Player name</Label>
          <Input id="player_name" disabled={isPending} {...register("player_name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="player_contact">Player contact</Label>
          <Input id="player_contact" disabled={isPending} {...register("player_contact")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select id="status" disabled={isPending} aria-invalid={!!errors.status} {...register("status")}>
          {WINNER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {WINNER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground">
          Moving to Claimed or Cancelled stamps the corresponding timestamp automatically.
          Cancelling also returns one unit to the prize's inventory.
        </p>
      </div>

      <Button type="submit" className="gap-2" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </Button>
    </form>
  );
}
