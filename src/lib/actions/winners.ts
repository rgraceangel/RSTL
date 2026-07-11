"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import {
  winnerCreateSchema,
  winnerUpdateSchema,
  type WinnerCreateFormValues,
  type WinnerUpdateFormValues,
} from "@/lib/validations/winner";
import type { WinnerStatus } from "@/types";

export interface ActionResult {
  error?: string;
}

const MANAGE_ROLES = ["admin", "super_admin"] as const;

function friendlyInsertError(message: string): string {
  if (message.toLowerCase().includes("out of stock")) {
    return "That prize is out of stock -- restock it before recording this win.";
  }
  if (message.toLowerCase().includes("no inventory record")) {
    return "That prize has no inventory record set up yet.";
  }
  return "Could not record this win. Please check the selected session and prize.";
}

/** Manually records a win for an existing (completed) game session. */
export async function createWinnerAction(values: WinnerCreateFormValues): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = winnerCreateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("game_sessions")
    .select("id, game_id, player_name")
    .eq("id", parsed.data.game_session_id)
    .maybeSingle();

  if (sessionError || !session) {
    return { error: "Selected game session could not be found." };
  }

  const { error: insertError } = await supabase.from("winner_records").insert({
    game_session_id: session.id,
    game_id: session.game_id,
    prize_id: parsed.data.prize_id,
    player_name: parsed.data.player_name || session.player_name || null,
    player_contact: parsed.data.player_contact || null,
  });

  if (insertError) {
    return { error: friendlyInsertError(insertError.message) };
  }

  revalidatePath("/admin/winners");
  redirect("/admin/winners");
}

/** Updates contact info and/or status. Timestamps + inventory restock are automatic (DB triggers). */
export async function updateWinnerAction(
  winnerId: string,
  values: WinnerUpdateFormValues
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = winnerUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("winner_records")
    .update({
      player_name: parsed.data.player_name || null,
      player_contact: parsed.data.player_contact || null,
      status: parsed.data.status,
    })
    .eq("id", winnerId);

  if (error) {
    return { error: "Could not update this winner record." };
  }

  revalidatePath("/admin/winners");
  revalidatePath(`/admin/winners/${winnerId}`);
  return {};
}

async function setStatus(winnerId: string, status: WinnerStatus): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("winner_records").update({ status }).eq("id", winnerId);

  if (error) {
    return { error: "Could not update this winner's status." };
  }

  revalidatePath("/admin/winners");
  revalidatePath(`/admin/winners/${winnerId}`);
  return {};
}

export async function markClaimedAction(winnerId: string): Promise<ActionResult> {
  return setStatus(winnerId, "claimed");
}

export async function markExpiredAction(winnerId: string): Promise<ActionResult> {
  return setStatus(winnerId, "expired");
}

/** Cancelling automatically restocks the prize (handle_prize_restock trigger). */
export async function cancelWinAction(winnerId: string): Promise<ActionResult> {
  return setStatus(winnerId, "cancelled");
}

/** Deleting also restocks automatically (same trigger fires on DELETE). */
export async function deleteWinnerAction(winnerId: string): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("winner_records").delete().eq("id", winnerId);

  if (error) {
    return { error: "Could not delete this winner record." };
  }

  revalidatePath("/admin/winners");
  return {};
}
