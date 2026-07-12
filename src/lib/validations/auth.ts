import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export type RequestPasswordResetValues = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ConfirmPasswordResetValues = z.infer<typeof confirmPasswordResetSchema>;

/**
 * The 6-digit code Supabase embeds in the recovery email via `{{ .Token }}`.
 * Verified through `supabase.auth.verifyOtp({ email, token, type: "recovery" })`
 * -- a reliable fallback to the clickable link, which can fail either because
 * an email client's link-safety scanner consumes the single-use link before
 * the admin clicks it, or because the PKCE code exchange requires the same
 * browser that submitted the request, which isn't guaranteed. A typed code
 * has neither of those failure modes: nothing can "click" it early, and
 * verifying it works from any browser as long as the email+code pair match.
 */
export const verifyRecoveryCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit code from your email.")
    .max(6, "Enter the 6-digit code from your email.")
    .regex(/^\d{6}$/, "The code should be 6 digits."),
});

export type VerifyRecoveryCodeValues = z.infer<typeof verifyRecoveryCodeSchema>;
