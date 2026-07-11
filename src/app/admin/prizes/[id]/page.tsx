import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getPrizeById } from "@/lib/queries/prizes";
import { PrizeForm } from "@/components/admin/prizes/PrizeForm";
import { updatePrizeAction } from "@/lib/actions/prizes";

export const metadata: Metadata = {
  title: "Edit Prize",
};

interface EditPrizePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPrizePage({ params }: EditPrizePageProps) {
  const { id } = await params;
  await requireRole(["admin", "super_admin"], `/admin/prizes/${id}`);

  const prize = await getPrizeById(id);
  if (!prize) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Prize</h1>
        <p className="text-muted-foreground">
          Stock total is managed via Restock on the prize list, not here.
        </p>
      </div>

      <PrizeForm prize={prize} onSubmit={(values) => updatePrizeAction(id, values)} />
    </div>
  );
}
