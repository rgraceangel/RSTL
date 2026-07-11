import type { Database } from "./supabase";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  navItems: NavItem[];
}

/**
 * A single pie slice on a `<Wheel>` (public homepage). Kept deliberately
 * data-only (no icon/component references) so it can cross the
 * server -> client component boundary as a plain serializable prop --
 * e.g. `getActivePrizesForWheel()` results mapped straight into these.
 */
export interface WheelSegment {
  id: string;
  label: string;
  /** CSS color (hex/hsl) used to fill the wedge. */
  color: string;
  /** Relative selection weight for weighted-random spins; defaults to 1. */
  weight?: number;
  /** Game Wheel only -- whether landing on this wedge advances the player. */
  outcome?: "advance" | "retry";
}

export type AdminProfile = Database["public"]["Tables"]["admins"]["Row"];
export type AdminRole = Database["public"]["Tables"]["admins"]["Row"]["role"];

export type {
  Database,
  Json,
  GameType,
  GameStatus,
  QuestionType,
  ImageType,
  PrizeType,
  SessionStatus,
  WinnerStatus,
} from "./supabase";
