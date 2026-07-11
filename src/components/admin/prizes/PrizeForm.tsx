"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { PrizeImageUpload } from "@/components/admin/prizes/PrizeImageUpload";
import { prizeSchema, PRIZE_TYPES, type PrizeFormValues } from "@/lib/validations/prize";
import { PRIZE_TYPE_LABELS } from "@/constants";
import type { PrizeDetail } from "@/lib/queries/prizes";

interface PrizeFormProps {
  prize?: PrizeDetail;
  onSubmit: (values: PrizeFormValues) => Promise<{ error?: string } | void>;
}

export function PrizeForm({ prize, onSubmit }: PrizeFormProps) {
  const isEditing = !!prize;
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PrizeFormValues>({
    resolver: zodResolver(prizeSchema),
    defaultValues: {
      name: prize?.name ?? "",
      description: prize?.description ?? "",
      image_url: prize?.image_url ?? "",
      prize_type: prize?.prize_type ?? "physical",
      value: prize?.value ?? 0,
      probability_weight: prize?.probability_weight ?? 0,
      is_active: prize?.is_active ?? true,
      quantity_total: prize?.quantity_total ?? 0,
      low_stock_threshold: prize?.low_stock_threshold ?? 10,
    },
  });

  const submit = (values: PrizeFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await onSubmit(values);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-6" noValidate>
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" disabled={isPending} aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" disabled={isPending} {...register("description")} />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Image</Label>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <PrizeImageUpload value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        {errors.image_url && (
          <p className="text-xs text-red-600">{errors.image_url.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="prize_type">Type</Label>
          <Select id="prize_type" disabled={isPending} {...register("prize_type")}>
            {PRIZE_TYPES.map((type) => (
              <option key={type} value={type}>
                {PRIZE_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="value">Value ($)</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.01"
            disabled={isPending}
            aria-invalid={!!errors.value}
            {...register("value")}
          />
          {errors.value && <p className="text-xs text-red-600">{errors.value.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="probability_weight">Draw weight</Label>
          <Input
            id="probability_weight"
            type="number"
            min="0"
            step="0.0001"
            disabled={isPending}
            aria-invalid={!!errors.probability_weight}
            {...register("probability_weight")}
          />
          {errors.probability_weight && (
            <p className="text-xs text-red-600">{errors.probability_weight.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="low_stock_threshold">Low stock threshold</Label>
          <Input
            id="low_stock_threshold"
            type="number"
            min="0"
            step="1"
            disabled={isPending}
            aria-invalid={!!errors.low_stock_threshold}
            {...register("low_stock_threshold")}
          />
          {errors.low_stock_threshold && (
            <p className="text-xs text-red-600">{errors.low_stock_threshold.message}</p>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-1.5">
          <Label htmlFor="quantity_total">Starting stock</Label>
          <Input
            id="quantity_total"
            type="number"
            min="0"
            step="1"
            disabled={isPending}
            aria-invalid={!!errors.quantity_total}
            {...register("quantity_total")}
          />
          <p className="text-xs text-muted-foreground">
            Adjust stock later from the prize list using Restock.
          </p>
          {errors.quantity_total && (
            <p className="text-xs text-red-600">{errors.quantity_total.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <div>
          <p className="text-sm font-medium">Available to players</p>
          <p className="text-xs text-muted-foreground">
            Automatically turned off when stock reaches zero.
          </p>
        </div>
        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
          )}
        />
      </div>

      <Button type="submit" className="gap-2" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isEditing ? "Save changes" : "Create prize"}
      </Button>
    </form>
  );
}
