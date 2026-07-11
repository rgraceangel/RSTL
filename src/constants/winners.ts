import type { WinnerStatus } from "@/types";

export const WINNER_STATUS_LABELS: Record<WinnerStatus, string> = {
  pending: "Pending",
  claimed: "Claimed",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const WINNER_STATUS_STYLES: Record<WinnerStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  claimed: "bg-emerald-100 text-emerald-700",
  expired: "bg-secondary text-secondary-foreground",
  cancelled: "bg-red-50 text-red-600",
};

export const WINNERS_PAGE_SIZE = 10;
export const WINNERS_EXPORT_LIMIT = 5000;
