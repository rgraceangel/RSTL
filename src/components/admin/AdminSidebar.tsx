"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants";
import { useAdmin } from "@/hooks/useAdmin";
import { hasRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const admin = useAdmin();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {ADMIN_NAV_ITEMS.filter((item) => !item.roles || hasRole(admin.role, item.roles)).map(
        (item) => {
          const isActive =
            item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        }
      )}
    </nav>
  );
}

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-background md:flex print:hidden">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Logo />
        </div>
        <NavLinks />
      </aside>

      {/* Mobile: off-canvas drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background md:hidden print:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Logo />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={onClose}
                  className="rounded-md p-2 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
