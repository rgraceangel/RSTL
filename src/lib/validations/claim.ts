import { z } from "zod";
import { nameSchema } from "./common";

/** Player-facing "claim your prize" form -- collects just enough to let an admin fulfill the win. */
export const claimSchema = z.object({
  player_name: nameSchema,
  player_contact: z
    .string()
    .min(5, "Enter an email or phone number so we can reach you")
    .max(200, "Must be at most 200 characters"),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;
