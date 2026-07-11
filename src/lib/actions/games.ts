"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole, getCurrentAdmin } from "@/lib/auth/session";
import { gameSchema, type GameFormValues } from "@/lib/validations/game";
import { getGameBySlugExists } from "@/lib/queries/games";
import type { Json } from "@/types";

export interface ActionResult {
  error?: string;
}

const MANAGE_ROLES = ["admin", "super_admin"] as const;

function buildConfig(values: GameFormValues): Json {
  let base: Record<string, Json> = {};
  if (values.additional_config) {
    try {
      base = JSON.parse(values.additional_config);
    } catch {
      base = {};
    }
  }
  return {
    ...base,
    default_time_limit_seconds: values.default_time_limit_seconds,
  };
}

function toNullableIso(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function createGameAction(values: GameFormValues): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = gameSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const slugTaken = await getGameBySlugExists(parsed.data.slug);
  if (slugTaken) {
    return { error: `The slug "${parsed.data.slug}" is already in use by another game.` };
  }

  const admin = await getCurrentAdmin();
  const supabase = await createClient();

  const { data: game, error } = await supabase
    .from("games")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      game_type: parsed.data.game_type,
      status: parsed.data.status,
      thumbnail_url: parsed.data.thumbnail_url || null,
      max_attempts_per_user: parsed.data.max_attempts_per_user,
      config: buildConfig(parsed.data),
      start_date: toNullableIso(parsed.data.start_date ?? ""),
      end_date: toNullableIso(parsed.data.end_date ?? ""),
      created_by: admin?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !game) {
    return { error: "Could not create the game. Please try again." };
  }

  revalidatePath("/admin/games");
  redirect(`/admin/games/${game.id}`);
}

export async function updateGameAction(gameId: string, values: GameFormValues): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = gameSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const slugTaken = await getGameBySlugExists(parsed.data.slug, gameId);
  if (slugTaken) {
    return { error: `The slug "${parsed.data.slug}" is already in use by another game.` };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("games")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      game_type: parsed.data.game_type,
      status: parsed.data.status,
      thumbnail_url: parsed.data.thumbnail_url || null,
      max_attempts_per_user: parsed.data.max_attempts_per_user,
      config: buildConfig(parsed.data),
      start_date: toNullableIso(parsed.data.start_date ?? ""),
      end_date: toNullableIso(parsed.data.end_date ?? ""),
    })
    .eq("id", gameId);

  if (error) {
    return { error: "Could not update the game. Please try again." };
  }

  revalidatePath("/admin/games");
  revalidatePath(`/admin/games/${gameId}`);
  return {};
}

/**
 * Quick enable/disable toggle used from the list -- flips only between
 * 'active' and 'paused'. Draft/archived are deliberately left to the full
 * edit form since those are lifecycle decisions, not a quick pause/resume.
 */
export async function toggleGameStatusAction(gameId: string, enabled: boolean): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("games")
    .update({ status: enabled ? "active" : "paused" })
    .eq("id", gameId);

  if (error) {
    return { error: "Could not update this game's status." };
  }

  revalidatePath("/admin/games");
  return {};
}

export async function deleteGameAction(gameId: string): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();

  const [sessionsRes, winnersRes] = await Promise.all([
    supabase.from("game_sessions").select("id", { count: "exact", head: true }).eq("game_id", gameId),
    supabase.from("winner_records").select("id", { count: "exact", head: true }).eq("game_id", gameId),
  ]);

  if ((sessionsRes.count ?? 0) > 0 || (winnersRes.count ?? 0) > 0) {
    return {
      error:
        "This game has recorded play sessions and/or wins, so deleting it would erase that history. Archive it instead.",
    };
  }

  const { error } = await supabase.from("games").delete().eq("id", gameId);
  if (error) {
    return { error: "Could not delete this game." };
  }

  revalidatePath("/admin/games");
  return {};
}
