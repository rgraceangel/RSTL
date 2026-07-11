import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "You are not authorized to access the admin panel.",
  forbidden: "You don't have permission to view that page.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialError = params.error ? ERROR_MESSAGES[params.error] : undefined;

  return <LoginForm redirectTo={params.redirect} initialError={initialError} />;
}
