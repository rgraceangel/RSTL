import type { PrizeType } from "@/types";

export const PRIZE_TYPE_LABELS: Record<PrizeType, string> = {
  physical: "Physical",
  digital: "Digital",
  voucher: "Voucher",
  points: "Points",
};

export const PRIZES_PAGE_SIZE = 10;
