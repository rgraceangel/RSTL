"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatCardTone = "default" | "warning" | "success";

const TONE_STYLES: Record<StatCardTone, string> = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
};

interface StatCardProps {
  label: string;
  value: string | number;
  /**
   * A rendered icon element (e.g. `<Gamepad2 className="h-4 w-4" />`), not a
   * bare component reference. Server Component pages that render this client
   * component must pass already-rendered JSX here -- passing a raw
   * lucide-react component reference across the server/client boundary
   * trips React's "Functions cannot be passed directly to Client Components"
   * error, since an unrendered component isn't serializable.
   */
  icon: ReactNode;
  description?: string;
  tone?: StatCardTone;
  index?: number;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  tone = "default",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: "easeOut" }}
      className="rounded-lg border border-border bg-background p-4"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className={cn("rounded-md p-2 [&_svg]:h-4 [&_svg]:w-4", TONE_STYLES[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
}
