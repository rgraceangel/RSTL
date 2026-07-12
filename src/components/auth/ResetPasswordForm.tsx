"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { requestPasswordResetAction, confirmPasswordResetAction } from "@/lib/auth/actions";
import {
  requestPasswordResetSchema,
  confirmPasswordResetSchema,
  type RequestPasswordResetValues,
  type ConfirmPasswordResetValues,
} from "@/lib/validations/auth";
import { LOGIN_PATH } from "@/constants";

type Phase = "loading" | "request" | "sent" | "confirm" | "expired";

/**
 * Reads the Supabase recovery session Supabase's own redirect appends as a
 * URL hash fragment (`#access_token=...&refresh_token=...&type=recovery`,
 * or `#error=...&error_code=otp_expired` if the link was already used,
 * previewed by an email client's link scanner, or genuinely expired).
 * Hash fragments never reach the server, so this has to run client-side --
 * there is no server component or middleware that can see this at all.
 */
function parseHash(): { access_token?: string; refresh_token?: string; error_description?: string } {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const params = new URLSearchParams(hash);
  return {
    access_token: params.get("access_token") ?? undefined,
    refresh_token: params.get("refresh_token") ?? undefined,
    error_description: params.get("error_description") ?? undefined,
  };
}

export function ResetPasswordForm() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [serverError, setServerError] = useState<string | undefined>();
  const [expiredReason, setExpiredReason] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const requestForm = useForm<RequestPasswordResetValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const confirmForm = useForm<ConfirmPasswordResetValues>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const { access_token, refresh_token, error_description } = parseHash();

    if (error_description) {
      setExpiredReason(decodeURIComponent(error_description.replace(/\+/g, " ")));
      setPhase("expired");
      // Strip the hash so a refresh doesn't re-trigger the same error state.
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    if (access_token && refresh_token) {
      const supabase = createClient();
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        window.history.replaceState(null, "", window.location.pathname);
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
      setPhase("sent");
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
          click them. Request a new one below and open it as soon as it arrives.
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
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 text-center shadow-sm"
      >
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
        <h1 className="mb-1 text-lg font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          If an account exists for that address, a password reset link is on its way. Open it
          promptly -- the link expires after a while and can only be used once.
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
          Enter your admin email and we&apos;ll send you a reset link.
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
