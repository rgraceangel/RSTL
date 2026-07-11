import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Gamepad2,
  Gift,
  Trophy,
  Users,
  BarChart3,
  ScrollText,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { AdminRole } from "@/types";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If set, only admins with one of these roles see this item. */
  roles?: AdminRole[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Games", href: "/admin/games", icon: Gamepad2 },
  { label: "Prizes", href: "/admin/prizes", icon: Gift },
  { label: "Winners", href: "/admin/winners", icon: Trophy },
  { label: "Sessions", href: "/admin/sessions", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Activity Logs", href: "/admin/activity-logs", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Admins", href: "/admin/admins", icon: ShieldCheck, roles: ["super_admin"] },
];
