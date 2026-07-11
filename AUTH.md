# Authentication

Admin authentication built on Supabase Auth (email/password) with
server-enforced authorization. No player-facing auth yet — this covers the
admin/back-office side only.

## Route map

```
src/app/
  layout.tsx                Root: fonts, global styles, SupabaseProvider (session-aware)
  (site)/
    layout.tsx               Public site chrome (Navbar/Footer via MainLayout)
    page.tsx                  Public home page
  (auth)/
    layout.tsx                Centered, chrome-free shell for auth screens
    login/page.tsx             Admin sign-in
  admin/
    layout.tsx                Protected: requireAdmin() + AdminProvider + AdminShell
    page.tsx                   Dashboard placeholder
```

`(site)` and `(auth)` are route groups — they organize layouts without
affecting the URL, so the public site is still at `/` and login is at
`/login`.

## How a request is protected

1. **`src/middleware.ts` → `updateSession()`** (`src/lib/supabase/middleware.ts`)
   runs on every request. It refreshes the Supabase session cookie, then:
   - blocks anonymous requests to `/admin/*`, redirecting to
     `/login?redirect=<path>`
   - blocks requests to `/admin/*` from a signed-in user who has no active
     `admins` row, redirecting to `/login?error=unauthorized`
   - redirects an already-signed-in admin away from `/login` to `/admin`

   This is a fast, edge-level guard — good for UX, not the sole source of truth.

2. **`src/app/admin/layout.tsx` → `requireAdmin()`** (`src/lib/auth/session.ts`)
   is the authoritative check. It re-verifies the session and admin row
   server-side on every render of anything under `/admin`, and redirects to
   `/login` if that fails. The resulting `AdminProfile` is passed into
   `AdminProvider`, so any Client Component under `/admin` can call
   `useAdmin()` to read it without an extra fetch.

3. **Row Level Security** (already in place from the database migrations)
   is the last line of defense: even if application code had a bug, Postgres
   itself won't return or accept writes the caller isn't entitled to.

## Login flow

`src/components/auth/LoginForm.tsx` (Client Component) collects email/password
with `react-hook-form` + a Zod schema (`src/lib/validations/auth.ts`), then
calls the `loginAction` Server Action (`src/lib/auth/actions.ts`) directly —
no API route needed.

`loginAction`:

1. Re-validates input server-side (defense in depth).
2. Calls `supabase.auth.signInWithPassword()`.
3. Looks up the `admins` row for the signed-in user — this is the role
   check at the point of entry. If there's no active admin row, it signs the
   session back out immediately and returns an error instead of leaving a
   valid-but-unauthorized session around.
4. Calls the `record_admin_login()` Postgres RPC to stamp `last_login_at`
   (see `supabase/migrations/20260709020000_admin_login_rpc.sql` — a
   `SECURITY DEFINER` function, since a plain admin isn't otherwise allowed
   to `UPDATE` the `admins` table).
5. `redirect()`s into the admin area (sanitized to stay within `/`, so a
   crafted `redirect` query param can't send anyone off-site).

Errors are returned as `{ error: string }` for the form to display; the
success path relies on `redirect()` propagating naturally (per Next.js docs,
it isn't caught in a try/catch).

## Logout

`src/components/admin/LogoutButton.tsx` calls the `logoutAction` Server
Action, which calls `supabase.auth.signOut()` and redirects to `/login`.

## Session management

- **Server side**: every request through the middleware refreshes the
  Supabase session cookie, so server components always see a current session
  without any client-side polling.
- **Client side**: `SupabaseProvider` (`src/components/providers/SupabaseProvider.tsx`)
  is seeded with the session fetched in the root layout (no flash of
  logged-out state), then subscribes to `supabase.auth.onAuthStateChange()`.
  On `SIGNED_IN`/`SIGNED_OUT` it calls `router.refresh()` so server-rendered
  content (like the admin shell) stays in sync with client-side auth changes
  — e.g. a session expiring or being revoked in another tab.
- Access it anywhere via `useSupabase()` → `{ supabase, session }`.

## Role checking

- `src/lib/auth/roles.ts`:
  - `hasRole(role, allowed[])` — is the role one of an explicit set?
  - `hasMinimumRole(role, minimum)` — does the role meet or exceed a
    privilege level, given the ordering `moderator < admin < super_admin`
    (`ROLE_HIERARCHY` in `src/constants/auth.ts`)?
- **Server-side, for a whole page/action**: `requireRole(['super_admin'])`
  (`src/lib/auth/session.ts`) — call after `requireAdmin()`; redirects to
  `/admin?error=forbidden` if the role doesn't match.
- **Client-side, for part of a page**: wrap content in
  `<RoleGate allowed={['super_admin']}>...</RoleGate>`
  (`src/components/admin/RoleGate.tsx`) to conditionally render UI based on
  the current admin's role.

## Bootstrapping the first admin

Every write policy on `admins` requires an existing `super_admin`, so the
first row has to be created with the `service_role` key (bypasses RLS) —
see the "Bootstrapping the first admin" section in `DATABASE.md`.

## Environment variables

No new variables beyond what's already in `.env.local.example`
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Not included yet

Player-facing authentication (anonymous sign-in for `game_sessions.player_id`),
password reset / magic-link flows, and multi-factor authentication are out of
scope for this pass.
