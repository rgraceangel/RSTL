import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasRole } from "@/lib/auth/roles";
import { LOGIN_PATH } from "@/constants";
import type { AdminProfile, AdminRole } from "@/types";

/**
 * Returns the signed-in admin's profile, or null if there is no session or
 * the signed-in user is not an active admin. Safe to call from any Server
 * Component, Server Action, or Route Handler.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return admin ?? null;
}

/**
 * Guarantees an active admin for the rest of the request; redirects to
 * /login (preserving the current path) otherwise. Use at the top of
 * protected Server Components / layouts.
 */
export async function requireAdmin(currentPath = "/admin"): Promise<AdminProfile> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    const redirectUrl = new URL(LOGIN_PATH, "http://localhost");
    redirectUrl.searchParams.set("redirect", currentPath);
    redirect(`${redirectUrl.pathname}${redirectUrl.search}`);
  }

  return admin;
}

/**
 * Guarantees the current admin holds one of `allowed` roles; redirects to
 * the admin dashboard with an error flag otherwise. Call after
 * requireAdmin() in role-restricted pages/actions.
 */
export async function requireRole(
  allowed: AdminRole[],
  currentPath = "/admin"
): Promise<AdminProfile> {
  const admin = await requireAdmin(currentPath);

  if (!hasRole(admin.role, allowed)) {
    redirect("/admin?error=forbidden");
  }

  return admin;
}
