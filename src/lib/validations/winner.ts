import { z } from "zod";

export const WINNER_STATUSES = ["pending", "claimed", "expired", "cancelled"] as const;

export const winnerCreateSchema = z.object({
  game_session_id: z.string().uuid("Select a game session"),
  prize_id: z.string().uuid("Select a prize"),
  player_name: z.string().max(160).optional().or(z.literal("")),
  player_contact: z.string().max(160).optional().or(z.literal("")),
});

export type WinnerCreateFormValues = z.infer<typeof winnerCreateSchema>;

export const winnerUpdateSchema = z.object({
  player_name: z.string().max(160).optional().or(z.literal("")),
  player_contact: z.string().max(160).optional().or(z.literal("")),
  status: z.enum(WINNER_STATUSES),
});

export type WinnerUpdateFormValues = z.infer<typeof winnerUpdateSchema>;
