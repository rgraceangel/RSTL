"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { prizeSchema, restockSchema, type PrizeFormValues, type RestockFormValues } from "@/lib/validations/prize";

export interface ActionResult {
  error?: string;
}

const MANAGE_ROLES = ["admin", "super_admin"] as const;

/** Creates a prize plus its initial inventory row in one request. */
export async function createPrizeAction(values: PrizeFormValues): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = prizeSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const { quantity_total, low_stock_threshold, ...prizeFields } = parsed.data;
  const supabase = await createClient();

  const { data: prize, error: insertError } = await supabase
    .from("prizes")
    .insert({
      ...prizeFields,
      description: prizeFields.description || null,
      image_url: prizeFields.image_url || null,
    })
    .select("id")
    .single();

  if (insertError || !prize) {
    return { error: "Could not create the prize. Please try again." };
  }

  const { error: inventoryError } = await supabase.from("prize_inventory").insert({
    prize_id: prize.id,
    quantity_total,
    low_stock_threshold,
  });

  if (inventoryError) {
    return { error: "Prize was created, but setting up inventory failed. Edit the prize to fix stock." };
  }

  revalidatePath("/admin/prizes");
  redirect("/admin/prizes");
}

/** Updates a prize's catalog fields. Stock totals are changed via restockPrizeAction instead. */
export async function updatePrizeAction(
  prizeId: string,
  values: PrizeFormValues
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = prizeSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const { low_stock_threshold, ...prizeFields } = parsed.data;
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("prizes")
    .update({
      ...prizeFields,
      description: prizeFields.description || null,
      image_url: prizeFields.image_url || null,
    })
    .eq("id", prizeId);

  if (updateError) {
    return { error: "Could not update the prize. Please try again." };
  }

  await supabase
    .from("prize_inventory")
    .update({ low_stock_threshold })
    .eq("prize_id", prizeId);

  revalidatePath("/admin/prizes");
  revalidatePath(`/admin/prizes/${prizeId}`);
  redirect("/admin/prizes");
}

export async function deletePrizeAction(prizeId: string): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("prizes").delete().eq("id", prizeId);

  if (error) {
    // Most common cause: on delete restrict from winner_records (a won prize
    // can't be removed outright). Surface a clear message instead of the raw
    // Postgres error.
    return { error: "This prize can't be deleted because it has recorded wins. Mark it unavailable instead." };
  }

  revalidatePath("/admin/prizes");
  return {};
}

export async function toggleAvailabilityAction(
  prizeId: string,
  isActive: boolean
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("prizes").update({ is_active: isActive }).eq("id", prizeId);

  if (error) {
    return { error: "Could not update availability." };
  }

  revalidatePath("/admin/prizes");
  return {};
}

/**
 * Adds `amount` units to a prize's stock (restock). Goes through the
 * `restock_prize` RPC rather than a select-then-update in application code --
 * the RPC does the increment as one atomic `quantity_total = quantity_total +
 * amount` UPDATE, so two concurrent restocks of the same prize (two admin
 * tabs, a double-submit) can never race and silently drop one of them.
 */
export async function restockPrizeAction(
  prizeId: string,
  values: RestockFormValues
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = restockSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid restock amount." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("restock_prize", {
    p_prize_id: prizeId,
    p_amount: parsed.data.amount,
  });

  if (error) {
    if (error.message.includes("No inventory record")) {
      return { error: "No inventory record found for this prize." };
    }
    return { error: "Could not restock this prize." };
  