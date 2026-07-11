import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Logs",
};

export default function ActivityLogsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Activity Logs</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
