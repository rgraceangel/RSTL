import type { AdminRole } from "@/types";
import { ROLE_HIERARCHY } from "@/constants";

/** True if `role` meets or exceeds `minimum` in privilege (moderator < admin < super_admin). */
export function hasMinimumRole(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum);
}

/** True if `role` is one of the explicitly `allowed` roles. */
export function hasRole(role: AdminRole, allowed: AdminRole[]): boolean {
  return allowed.includes(role);
}
