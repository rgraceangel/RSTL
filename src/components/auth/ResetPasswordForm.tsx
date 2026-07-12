"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { requestPasswordResetAction, confirmPasswordResetAction } from "@/lib/auth/actions";
import {
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  verifyRecoveryCodeSchema,
  type RequestPasswordResetValues,
  type ConfirmPasswordResetValues,
  type VerifyRecoveryCodeValues,
} from "@/lib/validations/auth";
import { LOGIN_PATH } from "@/constants";

type Phase = "loading" | "request" | "sent" | "confirm" | "expired";

interface AuthRedirectParams {
  code?: string;
  access_token?: string;
  refresh_token?: string;
  error_description?: string;
}

/**
 * Reads whatever Supabase's own redirect appended to this page after the
 * admin clicks the recovery link. Two different shapes are possible
 * depending on the auth flow Supabase decides to use for the client that
 * originally called `resetPasswordForEmail`:
 *
 *  - PKCE (the default for `@supabase/ssr`, which both our browser and
 *    server Supabase clients use): a `?code=...` query param, redeemed via
 *    `exchangeCodeForSession`. Errors (already-used/expired links) also
 *    land as query params (`?error=...&error_code=...&error_description=`).
 *  - Implicit grant (older/legacy flow): `#access_token=...&refresh_token=
 *    ...&type=recovery` as a URL *hash* fragment, redeemed via `setSession`.
 *    Errors land as `#error=...&error_code=...&error_description=...`.
 *
 * Hash fragments never reach the server, so all of this has to run
 * client-side -- there is no server component or middleware that can see
 * either shape. We check both so this keeps working regardless of which
 * flow Supabase/`@supabase/ssr` uses now or in the future.
 *
 * In practice the clickable link is unreliable for two separate reasons
 * (both observed in production for this project): an email client's
 * link-safety scanner can visit and consume the single-use link before the
 * admin ever clicks it, and the PKCE code exchange only succeeds if it
 * happens in the same browser that submitted the reset request, which
 * isn't guaranteed (e.g. request submitted on desktop, link opened on
 * phone). Because of that, the 6-digit code entered in the "sent" phase
 * below -- via `verifyOtp`, which has neither failure mode -- is the
 * primary, reliably-working path; this hash/query parsing is kept as a
 * convenience for the cases where the link *does* work.
 */
function parseAuthRedirect(): AuthRedirectParams {
  if (typeof window === "undefined") return {};

  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(
    window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
  );

  const errorDescription = search.get("error_description") ?? hash.get("error_description");

  return {
    code: search.get("code") ?? undefined,
    access_token: hash.get("access_token") ?? undefined,
    refresh_token: hash.get("refresh_token") ?? undefined,
    error_description: errorDescription ?? undefined,
  };
}

export function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [serverError, setServerError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const [expiredReason, setExpiredReason] = useState<string | undefined>();
  const [submittedEmail, setSubmittedEmail] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const requestForm = useForm<RequestPasswordResetValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<VerifyRecoveryCodeValues>({
    resolver: zodResolver(verifyRecoveryCodeSchema),
    defaultValues: { code: "" },
  });

  const confirmForm = useForm<ConfirmPasswordResetValues>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const { code, access_token, refresh_token, error_description } = parseAuthRedirect();
    const clearUrl = () => window.history.replaceState(null, "", window.location.pathname);

    if (error_description) {
      // This runs on first mount, typically in a fresh tab opened from the
      // email link -- there's no `submittedEmail` in this page load to fall
      // back to a code-entry form with, so "expired" (with its own "request
      // a new link" button, which re-sends both a link and a code) is the
      // right state here.
      clearUrl();
      setExpiredReason(decodeURIComponent(error_description.replace(/\+/g, " ")));
      setPhase("expired");
      return;
    }

    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        clearUrl();
        if (error) {
          setExpiredReason("This reset link is invalid or has expired.");
          setPhase("expired");
        } else {
          setPhase("confirm");
        }
      });
      return;
    }

    if (access_token && refresh_token) {
      const supabase = createClient();
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        clearUrl();
        if (error) {
          setExpiredReason("This reset link is invalid or has expired.");
          setPhase("expired");
        } else {
          setPhase("confirm");
        }
      });
      return;
    }

    setPhase("request");
  }, []);

  const onRequestSubmit = (values: RequestPasswordResetValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      setSubmittedEmail(values.email);
      codeForm.reset({ code: "" });
      setPhase("sent");
    });
  };

  const onCodeSubmit = (values: VerifyRecoveryCodeValues) => {
    if (!submittedEmail) return;
    setCodeError(undefined);
    setIsVerifyingCode(true);
    const supabase = createClient();
    supabase.auth
      .verifyOtp({ email: submittedEmail, token: values.code, type: "recovery" })
      .then(({ error }) => {
        setIsVerifyingCode(false);
        if (error) {
          setCodeError("That code is incorrect or has expired. Check your email for the latest one.");
          return;
        }
        setPhase("confirm");
      });
  };

  const onConfirmSubmit = (values: ConfirmPasswordResetValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await confirmPasswordResetAction(values);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  };

  if (phase === "loading") {
    return (
      <div className="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking your link…
      </div>
    );
  }

  if (phase === "expired") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm"
      >
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{expiredReason ?? "This reset link is invalid or has expired."}</span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Links sometimes get consumed by an email client&apos;s link-safety scanner before you
          click them, or only work in the browser that requested them. Request a new one below --
          you can enter the 6-digit code from that email instead of clicking the link.
        </p>
        <Button className="w-full" onClick={() => setPhase("request")}>
          Request a new link
        </Button>
      </motion.div>
    );
  }

  if (phase === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm"
      >
        <div className="mb-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
          <h1 className="mb-1 text-lg font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for that address, we sent a link and a 6-digit code. The code is
            the most reliable option -- enter it below.
          </p>
        </div>

        {codeError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{codeError}</span>
          </div>
        )}

        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="code">6-digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              disabled={isVerifyingCode}
              aria-invalid={!!codeForm.formState.errors.code}
              className="text-center text-lg tracking-[0.5em]"
              {...codeForm.register("code")}
            />
            {codeForm.formState.errors.code && (
              <p className="text-xs text-red-600">{codeForm.formState.errors.code.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isVerifyingCode}>
            {isVerifyingCode ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {isVerifyingCode ? "Verifying…" : "Verify code"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href={LOGIN_PATH} className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    );
  }

  if (phase === "confirm") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm"
      >
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-lg font-semibold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isPending}
                aria-invalid={!!confirmForm.formState.errors.password}
                className="pr-10"
                {...confirmForm.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmForm.formState.errors.password && (
              <p className="text-xs text-red-600">{confirmForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isPending}
              aria-invalid={!!confirmForm.formState.errors.confirmPassword}
              {...confirmForm.register("confirmPassword")}
            />
            {confirmForm.formState.errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {confirmForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {isPending ? "Saving…" : "Save new password"}
          </Button>
        </form>
      </motion.div>
    );
  }

  // phase === "request"
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm"
    >
      <div className="mb-6 space-y-1 text-center">
        <h1 className="text-lg font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your admin email and we&apos;ll send you a reset link and code.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            aria-invalid={!!requestForm.formState.errors.email}
            {...requestForm.register("email")}
          />
          {requestForm.formState.errors.email && (
            <p className="text-xs text-red-600">{requestForm.formState.errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href={LOGIN_PATH} className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
