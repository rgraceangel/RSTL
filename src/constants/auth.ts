import type { AdminRole } from "@/types";

/** Ordered from least to most privileged. Index is used for hierarchy checks. */
export const ROLE_HIERARCHY: AdminRole[] = ["moderator", "admin", "super_admin"];

export const ROLE_LABELS: Record<AdminRole, string> = {
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super Admin",
};

export const ROLE_BADGE_STYLES: Record<AdminRole, string> = {
  moderator: "bg-secondary text-secondary-foreground",
  admin: "bg-primary/10 text-primary",
  super_admin: "bg-primary text-primary-foreground",
};

export const LOGIN_REDIRECT_DEFAULT = "/admin";
export const LOGIN_PATH = "/login";
export const RESET_PASSWORD_PATH = "/reset-password";
