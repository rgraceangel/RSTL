"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Gift, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useSound } from "@/hooks/useSound";
import { claimPrizeAction } from "@/lib/actions/game-sessions";
import { claimSchema, type ClaimFormValues } from "@/lib/validations/claim";

interface ClaimFormProps {
  winnerRecordId: string;
  prizeName: string;
  onClaimed: () => void;
}

/**
 * "Claim flow" -- collects the winner's name + contact info and calls
 * `claimPrizeAction` (the `claim_prize_win` RPC under the hood). Mirrors
 * `LoginForm.tsx`'s RHF + Zod + `useTransition` conventions.
 */
export function ClaimForm({ winnerRecordId, prizeName, onClaimed }: ClaimFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const { playError } = useSound();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: { player_name: "", player_contact: "" },
  });

  const onSubmit = (values: ClaimFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await claimPrizeAction(winnerRecordId, values.player_name, values.player_contact);
      if ("error" in result) {
        setServerError(result.error);
        playError();
        return;
      }
      onClaimed();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Gift className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-semibold">Claim your {prizeName}</h2>
        <p className="text-sm text-muted-foreground">Tell us who you are so an admin can get your prize to you.</p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="player_name">Name</Label>
          <Input
            id="player_name"
            autoComplete="name"
            placeholder="Jane Doe"
            disabled={isPending}
            aria-invalid={!!errors.player_name}
            {...register("player_name")}
          />
          {errors.player_name && <p className="text-xs text-red-600">{errors.player_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="player_contact">Email or phone</Label>
          <Input
            id="player_contact"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            aria-invalid={!!errors.player_contact}
            {...register("player_contact")}
          />
          {errors.player_contact && <p className="text-xs text-red-600">{errors.player_contact.message}</p>}
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Submitting..." : "Claim Prize"}
        </Button>
      </form>
    </motion.div>
  );
}
