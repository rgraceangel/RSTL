import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { getWinnerDetail } from "@/lib/queries/winners";
import { WinnerEditForm } from "@/components/admin/winners/WinnerEditForm";
import { WinnerTimeline } from "@/components/admin/winners/WinnerTimeline";
import { RoleGate } from "@/components/admin/RoleGate";

export const metadata: Metadata = {
  title: "Winner Details",
};

interface WinnerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WinnerDetailPage({ params }: WinnerDetailPageProps) {
  const { id } = await params;
  await requireAdmin(`/admin/winners/${id}`);

  const winner = await getWinnerDetail(id);
  if (!winner) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Winner Details</h1>
        <p className="text-muted-foreground">
          Full history for this win, plus the linked game session and prize.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Details
          </h2>
          <RoleGate
            allowed={["admin", "super_admin"]}
            fallback={<p className="text-sm text-muted-foreground">View only — ask an admin to make changes.</p>}
          >
            <WinnerEditForm winner={winner} />
          </RoleGate>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Prize History
          </h2>
          <WinnerTimeline winner={winner} />
        </div>
      </div>
    </div>
  );
}
