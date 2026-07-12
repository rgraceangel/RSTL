import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

/**
 * Serves two purposes depending on how it's reached:
 *
 *  1. Visited directly (e.g. via the "Forgot password?" link on /login) --
 *     shows a form to request a recovery email.
 *  2. Reached via the link in that email -- Supabase's implicit-grant
 *     recovery flow appends the session as a URL *hash* fragment
 *     (`#access_token=...&type=recovery`, or `#error=...` if the link was
 *     already used or expired), which never reaches the server. All of
 *     that parsing, plus the "set a new password" form, happens client-side
 *     in ResetPasswordForm.
 */
export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
