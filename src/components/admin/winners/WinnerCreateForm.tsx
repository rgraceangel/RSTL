"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { winnerCreateSchema, type WinnerCreateFormValues } from "@/lib/validations/winner";
import { createWinnerAction } from "@/lib/actions/winners";
import type { OptionItem, SessionOption } from "@/lib/queries/winners";

interface WinnerCreateFormProps {
  sessions: SessionOption[];
  prizes: OptionItem[];
}

export function WinnerCreateForm({ sessions, prizes }: WinnerCreateFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WinnerCreateFormValues>({
    resolver: zodResolver(winnerCreateSchema),
    defaultValues: { game_session_id: "", prize_id: "", player_name: "", player_contact: "" },
  });

  const submit = (values: WinnerCreateFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await createWinnerAction(values);
      if (result?.error) setServerError(result.error);
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

      <div className="space-y-1.5">
        <Label htmlFor="game_session_id">Game session</Label>
        <Select
          id="game_session_id"
          disabled={isPending}
          aria-invalid={!!errors.game_session_id}
          {...register("game_session_id")}
        >
          <option value="">Select a completed session…</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.label}
            </option>
          ))}
        </Select>
        {errors.game_session_id && (
          <p className="text-xs text-red-600">{errors.game_session_id.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="prize_id">Prize</Label>
        <Select
          id="prize_id"
          disabled={isPending}
          aria-invalid={!!errors.prize_id}
          {...register("prize_id")}
        >
          <option value="">Select a prize…</option>
          {prizes.map((prize) => (
            <option key={prize.id} value={prize.id}>
              {prize.label}
            </option>
          ))}
        </Select>
        {errors.prize_id && <p className="text-xs text-red-600">{errors.prize_id.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="player_name">Player name (optional)</Label>
          <Input id="player_name" disabled={isPending} {...register("player_name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="player_contact">Player contact (optional)</Label>
          <Input id="player_contact" disabled={isPending} {...register("player_contact")} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Recording a win deducts one unit from the prize&apos;s inventory immediately, and the prize is
        automatically marked unavailable if that was the last unit.
      </p>

      <Button type="submit" className="gap-2" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Record win
      </Button>
    </form>
  );
}
