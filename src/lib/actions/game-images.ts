"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import type { ImageType } from "@/types";

export interface ActionResult {
  error?: string;
}

const MANAGE_ROLES = ["admin", "super_admin"] as const;

export async function addGameImageAction(
  gameId: string,
  input: { image_url: string; image_type: ImageType; alt_text?: string }
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  if (!input.image_url) {
    return { error: "Upload an image first." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("game_images").insert({
    game_id: gameId,
    image_url: input.image_url,
    image_type: input.image_type,
    alt_text: input.alt_text || null,
  });

  if (error) {
    return { error: "Could not save this image. Please try again." };
  }

  revalidatePath(`/admin/games/${gameId}`);
  return {};
}

export async function deleteGameImageAction(gameId: string, imageId: string): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("game_images").delete().eq("id", imageId);

  if (error) {
    return { error: "Could not remove this image." };
  }

  revalidatePath(`/admin/games/${gameId}`);
  return {};
}
