import { z } from "zod";

export const GAME_TYPES = [
  "quiz",
  "spin_wheel",
  "claw_machine",
  "scratch_card",
  "slot_machine",
  "decoder",
  "guess_the_gibberish",
  "name_it_to_win_it",
  "logo_challenge",
  "chemical_symbol_challenge",
  "true_or_false",
  "guess_the_unit",
  "measurement_challenge",
  "equipment_match",
  "which_laboratory",
  "hazard_symbol",
  "odd_one_out",
  "word_scramble",
  "emoji_science",
  "picture_puzzle",
  "memory_challenge",
  "spot_the_difference",
  "ppe_challenge",
  "calibration_challenge",
  "science_bingo",
  "science_facts",
  "mini_crossword",
  "wheel_of_science_facts",
] as const;
export const GAME_STATUSES = ["draft", "active", "paused", "archived"] as const;

export const gameSchema = z
  .object({
    name: z.string().min(2, "Must be at least 2 characters").max(120),
    slug: z
      .string()
      .min(2, "Must be at least 2 characters")
      .max(80)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
    description: z.string().max(4000).optional().or(z.literal("")),
    game_type: z.enum(GAME_TYPES),
    status: z.enum(GAME_STATUSES),
    thumbnail_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    max_attempts_per_user: z.coerce.number().int().min(1, "Must be at least 1"),
    default_time_limit_seconds: z.coerce.number().int().min(5, "Must be at least 5 seconds"),
    additional_config: z.string().max(10000).optional().or(z.literal("")),
    start_date: z.string().optional().or(z.literal("")),
    end_date: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.additional_config) return true;
      try {
        const parsed = JSON.parse(data.additional_config);
        return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
      } catch {
        return false;
      }
    },
    { message: "Additional config must be valid JSON (an object)", path: ["additional_config"] }
  )
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date).getTime() > new Date(data.start_date).getTime();
    },
    { message: "End date must be after the start date", path: ["end_date"] }
  );

export type GameFormValues = z.infer<typeof gameSchema>;
