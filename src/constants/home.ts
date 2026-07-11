import type { WheelSegment } from "@/types";

/**
 * Shared decorative palette for both wheels on the public homepage. Cycled
 * with `WHEEL_COLORS[index % WHEEL_COLORS.length]` so any segment count
 * (fixed Game Wheel categories or a variable, DB-driven prize catalog)
 * gets consistent, non-repeating-looking colors.
 */
export const WHEEL_COLORS = [
  "#2563eb", // blue
  "#0d9488", // teal
  "#7c3aed", // violet
  "#d97706", // amber
  "#059669", // emerald
  "#db2777", // pink
  "#4f46e5", // indigo
  "#0891b2", // cyan
] as const;

export const HOME_HERO = {
  eyebrow: "Science-Powered Prize Lab",
  title: "Run the Experiment. Win the Prize.",
  subtitle:
    "Spin the Game Wheel to prove your luck, unlock the Prize Wheel, and see what the lab has in store -- powered live by the current prize catalog.",
  primaryCta: { label: "Start Spinning", href: "#play" },
  secondaryCta: { label: "See How It Works", href: "#how-it-works" },
} as const;

/**
 * Fixed Game Wheel categories. Three of six wedges advance the player
 * (`outcome: "advance"`), three send them back for another spin -- a 50%
 * chance per spin, fully determined by which wedge the wheel lands on
 * (no hidden RNG contradicting what's on screen).
 */
export const GAME_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "physics", label: "Physics", color: WHEEL_COLORS[0], outcome: "advance" },
  { id: "chemistry", label: "Chemistry", color: WHEEL_COLORS[1], outcome: "retry" },
  { id: "biology", label: "Biology", color: WHEEL_COLORS[2], outcome: "advance" },
  { id: "astronomy", label: "Astronomy", color: WHEEL_COLORS[3], outcome: "retry" },
  { id: "genetics", label: "Genetics", color: WHEEL_COLORS[4], outcome: "advance" },
  { id: "robotics", label: "Robotics", color: WHEEL_COLORS[5], outcome: "retry" },
];

/**
 * Prize Wheel content when fewer than 3 active prizes exist in the catalog
 * yet (e.g. a freshly-deployed instance before an admin has added prizes).
 * Real, deployable copy for a science-prize platform -- not a "coming soon"
 * placeholder. Once 3+ active prizes exist, `getActivePrizesForWheel()`
 * results replace this entirely.
 */
export const PRIZE_WHEEL_FALLBACK: WheelSegment[] = [
  { id: "fallback-lab-kit", label: "Lab Kit", color: WHEEL_COLORS[0], weight: 1 },
  { id: "fallback-ebook", label: "E-Book Bundle", color: WHEEL_COLORS[1], weight: 1 },
  { id: "fallback-voucher", label: "Store Voucher", color: WHEEL_COLORS[2], weight: 1 },
  { id: "fallback-points", label: "500 Points", color: WHEEL_COLORS[3], weight: 1 },
  { id: "fallback-telescope", label: "Telescope Kit", color: WHEEL_COLORS[4], weight: 1 },
  { id: "fallback-access", label: "Premium Access", color: WHEEL_COLORS[5], weight: 1 },
];

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: "spin",
    title: "Spin the Game Wheel",
    description: "Take a chance across six science categories -- land on a winning subject to advance.",
  },
  {
    id: "advance",
    title: "Land a Success",
    description: "Three of six wedges advance you forward. Miss it and the wheel is yours again.",
  },
  {
    id: "unlock",
    title: "Unlock the Prize Wheel",
    description: "A successful spin breaks the lock on the Prize Wheel, revealing it in real time.",
  },
  {
    id: "win",
    title: "Reveal Your Prize",
    description: "Spin again to land on a prize drawn straight from the live prize catalog.",
  },
];
