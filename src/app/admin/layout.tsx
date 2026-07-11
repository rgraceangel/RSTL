import { requireAdmin } from "@/lib/auth/session";
import { AdminProvider } from "@/components/providers/AdminProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminProvider admin={admin}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
