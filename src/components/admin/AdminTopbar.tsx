"use client";

import { Menu } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ROLE_LABELS, ROLE_BADGE_STYLES } from "@/constants";
import { cn } from "@/lib/utils";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const admin = useAdmin();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6 print:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-muted md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">{admin.full_name}</p>
          <span
            className={cn(
              "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              ROLE_BADGE_STYLES[admin.role]
            )}
          >
            {ROLE_LABELS[admin.role]}
          </span>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
