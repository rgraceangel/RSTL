import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/login";

/**
 * Refreshes the Supabase session cookie on every request (required for
 * Server Components, which can't set cookies themselves) and enforces
 * route protection for the admin area:
 *
 *  - /admin/*  without a session          -> redirect to /login?redirect=<path>
 *  - /admin/*  with a session but no       -> redirect to /login?error=unauthorized
 *              active admins row
 *  - /login    with an active admin       -> redirect to /admin
 *
 * This is a fast, edge-level guard. The authoritative check still happens
 * server-side in src/app/admin/layout.tsx via requireAdmin(), since
 * middleware runs before rendering and shouldn't be the only gate.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginRoute = pathname.startsWith(LOGIN_PATH);

  if (isProtectedRoute) {
    if (!user) {
      const redirectUrl = new URL(LOGIN_PATH, request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("id, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin || !admin.is_active) {
      const redirectUrl = new URL(LOGIN_PATH, request.url);
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return response;
}
