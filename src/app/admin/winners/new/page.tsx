import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getRecentCompletedSessions, getActivePrizeOptions } from "@/lib/queries/winners";
import { WinnerCreateForm } from "@/components/admin/winners/WinnerCreateForm";

export const metadata: Metadata = {
  title: "Record Win",
};

export default async function NewWinnerPage() {
  await requireRole(["admin", "super_admin"], "/admin/winners/new");

  const [sessions, prizes] = await Promise.all([
    getRecentCompletedSessions(),
    getActivePrizeOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Record Win</h1>
        <p className="text-muted-foreground">
          Manually record a prize win for an existing completed game session.
        </p>
      </div>

      <WinnerCreateForm sessions={sessions} prizes={prizes} />
    </div>
  );
}
