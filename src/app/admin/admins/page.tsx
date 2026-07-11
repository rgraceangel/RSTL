import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admins",
};

export default async function AdminsPage() {
  // Extra page-level gate: even though the sidebar only shows this link to
  // super_admins, enforce it server-side too in case someone navigates here
  // directly.
  await requireRole(["super_admin"], "/admin/admins");

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Admins</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
