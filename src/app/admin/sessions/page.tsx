import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions",
};

export default function SessionsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Sessions</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
