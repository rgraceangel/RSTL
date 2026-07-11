"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { LOGIN_PATH, LOGIN_REDIRECT_DEFAULT } from "@/constants";

export interface LoginActionResult {
  error?: string;
}

/** Only allow redirecting back into the admin area, never to an external URL. */
function sanitizeRedirect(redirectTo: string | undefined | null): string {
  if (!redirectTo) return LOGIN_REDIRECT_DEFAULT;
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return LOGIN_REDIRECT_DEFAULT;
  }
  return redirectTo;
}

/**
 * Authenticates an admin with email/password, verifies they have an active
 * admins row (role checking happens here, at the point of entry), records
 * the login timestamp, and redirects into the admin area on success.
 *
 * Returns { error } instead of throwing on expected failure paths so the
 * calling form can display a message; redirect() is left to propagate
 * naturally on success.
 */
export async function loginAction(
  values: LoginFormValues,
  redirectTo?: string
): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id, is_active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!admin || !admin.is_active) {
    // Don't leave a valid session around for a non-admin / deactivated admin.
    await supabase.auth.signOut();
    return { error: "This account is not authorized to access the admin panel." };
  }

  await supabase.rpc("record_admin_login");

  redirect(sanitizeRedirect(redirectTo));
}

/** Signs the current admin out and returns them to the login screen. */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
