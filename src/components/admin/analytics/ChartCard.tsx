import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Shared chart container for `/admin/analytics` -- matches the plain
 * `rounded-lg border border-border` panel style already used by the
 * Dashboard's "Recent Winners"/"Recent Activity" panels
 * (`src/app/admin/page.tsx`), just with a chart instead of a list.
 */
export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
