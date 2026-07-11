import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { PrizeForm } from "@/components/admin/prizes/PrizeForm";
import { createPrizeAction } from "@/lib/actions/prizes";

export const metadata: Metadata = {
  title: "New Prize",
};

export default async function NewPrizePage() {
  await requireRole(["admin", "super_admin"], "/admin/prizes/new");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Prize</h1>
        <p className="text-muted-foreground">Add a prize to the catalog and set its starting stock.</p>
      </div>

      <PrizeForm onSubmit={(values) => createPrizeAction(values)} />
    </div>
  );
}
