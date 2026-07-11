"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { gameSchema, GAME_TYPES, GAME_STATUSES, type GameFormValues } from "@/lib/validations/game";
import { GAME_TYPE_LABELS, GAME_STATUS_LABELS } from "@/constants";
import { slugify } from "@/lib/utils";
import type { GameDetail } from "@/lib/queries/games";

interface GameFormProps {
  game?: GameDetail;
  onSubmit: (values: GameFormValues) => Promise<{ error?: string } | void>;
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function GameForm({ game, onSubmit }: GameFormProps) {
  const isEditing = !!game;
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(isEditing);

  const config = (game?.config ?? {}) as Record<string, unknown>;
  const { default_time_limit_seconds: _omit, ...restConfig } = config;
  void _omit;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      name: game?.name ?? "",
      slug: game?.slug ?? "",
      description: game?.description ?? "",
      game_type: game?.game_type ?? "quiz",
      status: game?.status ?? "draft",
      thumbnail_url: game?.thumbnail_url ?? "",
      max_attempts_per_user: game?.max_attempts_per_user ?? 1,
      default_time_limit_seconds:
        typeof config.default_time_limit_seconds === "number" ? config.default_time_limit_seconds : 30,
      additional_config: Object.keys(restConfig).length > 0 ? JSON.stringify(restConfig, null, 2) : "",
      start_date: toDatetimeLocal(game?.start_date ?? null),
      end_date: toDatetimeLocal(game?.end_date ?? null),
    },
  });

  const nameValue = watch("name");

  const submit = (values: GameFormValues) => {
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
        <Input
          id="name"
          disabled={isPending}
          aria-invalid={!!errors.name}
          {...register("name", {
            onChange: (e) => {
              if (!slugTouched) {
                setValue("slug", slugify(e.target.value), { shouldValidate: true });
              }
            },
          })}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          disabled={isPending}
          aria-invalid={!!errors.slug}
          {...register("slug", {
            onChange: () => setSlugTouched(true),
          })}
        />
        <p className="text-xs text-muted-foreground">
          Auto-filled from the name ({slugify(nameValue || "") || "…"}) until you edit it directly.
        </p>
        {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" disabled={isPending} {...register("description")} />
      </div>

      <div className="space-y-1.5">
        <Label>Thumbnail</Label>
        <Controller
          name="thumbnail_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? ""}
              onChange={field.onChange}
              bucket="game-images"
              alt="Game thumbnail"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="game_type">Game type</Label>
          <Select id="game_type" disabled={isPending} {...register("game_type")}>
            {GAME_TYPES.map((type) => (
              <option key={type} value={type}>
                {GAME_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" disabled={isPending} {...register("status")}>
            {GAME_STATUSES.map((status) => (
              <option key={status} value={status}>
                {GAME_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="max_attempts_per_user">Max attempts per player</Label>
          <Input
            id="max_attempts_per_user"
            type="number"
            min="1"
            step="1"
            disabled={isPending}
            aria-invalid={!!errors.max_attempts_per_user}
            {...register("max_attempts_per_user")}
          />
          {errors.max_attempts_per_user && (
            <p className="text-xs text-red-600">{errors.max_attempts_per_user.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="default_time_limit_seconds">Default question timer (seconds)</Label>
          <Input
            id="default_time_limit_seconds"
            type="number"
            min="5"
            step="1"
            disabled={isPending}
            aria-invalid={!!errors.default_time_limit_seconds}
            {...register("default_time_limit_seconds")}
          />
          {errors.default_time_limit_seconds && (
            <p className="text-xs text-red-600">{errors.default_time_limit_seconds.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date (optional)</Label>
          <Input id="start_date" type="datetime-local" disabled={isPending} {...register("start_date")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End date (optional)</Label>
          <Input id="end_date" type="datetime-local" disabled={isPending} {...register("end_date")} />
          {errors.end_date && <p className="text-xs text-red-600">{errors.end_date.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="additional_config">Additional config (JSON, optional)</Label>
        <Textarea
          id="additional_config"
          rows={6}
          className="font-mono text-xs"
          placeholder="{}"
          disabled={isPending}
          aria-invalid={!!errors.additional_config}
          {...register("additional_config")}
        />
        <p className="text-xs text-muted-foreground">
          Game-type-specific settings (e.g. spin wheel segments). The default timer above is stored
          separately and merged in automatically -- no need to repeat it here.
        </p>
        {errors.additional_config && (
          <p className="text-xs text-red-600">{errors.additional_config.message}</p>
        )}
      </div>

      <Button type="submit" className="gap-2" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isEditing ? "Save changes" : "Create game"}
      </Button>
    </form>
  );
}
