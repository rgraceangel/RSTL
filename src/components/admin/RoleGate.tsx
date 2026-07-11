"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { hasRole } from "@/lib/auth/roles";
import type { AdminRole } from "@/types";

interface RoleGateProps {
  allowed: AdminRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders `children` only if the signed-in admin's role is in `allowed`. */
export function RoleGate({ allowed, children, fallback = null }: RoleGateProps) {
  const admin = useAdmin();
  return hasRole(admin.role, allowed) ? <>{children}</> : <>{fallback}</>;
}
