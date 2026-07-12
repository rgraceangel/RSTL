"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  type LoginFormValues,
  type RequestPasswordResetValues,
  type ConfirmPasswordResetValues,
} from "@/lib/validations/auth";
import { LOGIN_PATH, LOGIN_REDIRECT_DEFAULT, RESET_PASSWORD_PATH } from "@/constants";

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

export interface PasswordResetResult {
  error?: string;
  success?: boolean;
}

/**
 * Sends a password recovery email whose link redirects into
 * `RESET_PASSWORD_PATH` (rather than Supabase's project-wide default Site
 * URL) -- that page is the one built to actually read the recovery
 * session out of the URL and let the admin set a new password. Always
 * returns `success: true` regardless of whether the address is a real
 * admin account, so this can never be used to enumerate valid emails.
 */
export async function requestPasswordResetAction(
  values: RequestPasswordResetValues
): Promise<PasswordResetResult> {
  const parsed = requestPasswordResetSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}${RESET_PASSWORD_PATH}`,
  });

  return { success: true };
}

/**
 * Sets a new password for whoever currently holds the recovery session
 * established client-side (see `ResetPasswordForm`, which exchanges the
 * URL's access/refresh tokens via `supabase.auth.setSession` before this
 * runs). Signs that temporary session out afterward so the admin logs in
 * fresh through the normal `loginAction` path -- keeping the admins-table
 * role check as the single source of truth for "authorized," exactly as
 * for a normal sign-in.
 */
export async function confirmPasswordResetAction(
  values: ConfirmPasswordResetValues
): Promise<PasswordResetResult> {
  const parsed = confirmPasswordResetSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: "Could not update your password. Please try again." };
  }

  await supabase.auth.signOut();
  redirect(`${LOGIN_PATH}?reset=success`);
}
