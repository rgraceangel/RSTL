import { z } from "zod";

export const PRIZE_TYPES = ["physical", "digital", "voucher", "points"] as const;

export const prizeSchema = z.object({
  name: z.string().min(2, "Must be at least 2 characters").max(120),
  description: z.string().max(2000).optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  prize_type: z.enum(PRIZE_TYPES),
  value: z.coerce.number().min(0, "Must be 0 or more"),
  probability_weight: z.coerce.number().min(0, "Must be 0 or more"),
  is_active: z.boolean(),
  quantity_total: z.coerce.number().int().min(0, "Must be 0 or more"),
  low_stock_threshold: z.coerce.number().int().min(0, "Must be 0 or more"),
});

export type PrizeFormValues = z.infer<typeof prizeSchema>;

export const restockSchema = z.object({
  amount: z.coerce.number().int().positive("Enter a positive number"),
});

export type RestockFormValues = z.infer<typeof restockSchema>;
