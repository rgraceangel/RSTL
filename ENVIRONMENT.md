# Environment Variables

Copy `.env.local.example` to `.env.local` for local development
(`cp .env.local.example .env.local`) and fill in the values below. In
production (Vercel or any other host), set the same variables in that
host's environment/secrets configuration -- there is no other config file
the app reads at runtime.

| Variable | Required | Read by | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts` | Your Supabase project's API URL, e.g. `https://abcdefgh.supabase.co`. Found in Supabase Dashboard -> Project Settings -> API. Prefixed `NEXT_PUBLIC_` because both the browser client and the server client need it. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Same three files as above | Your Supabase project's anon/public API key (same dashboard page). Safe to expose to the browser by design -- it's the key RLS policies are built to constrain, not a secret. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Not yet read by any code path, but reserved for absolute-URL needs (e.g. metadata, OG tags, email links in a future notifications feature) | The canonical public URL of the deployment, e.g. `https://yourdomain.com` (or `http://localhost:3000` locally). Set it now so nothing needs to change when those features land. |
| `SUPABASE_SERVICE_ROLE_KEY` | No (reserved) | Not read by the running app at all | Your Supabase project's service_role key (same dashboard page). This key **bypasses Row Level Security entirely** -- it's used exactly once, manually, to bootstrap the first `super_admin` row (see `DEPLOYMENT.md` Step 4), and is reserved for future server-only scripts (e.g. a scheduled analytics aggregation job, Section 19). **Never** set this as a `NEXT_PUBLIC_*` variable, never commit it, and don't add it to your hosting provider's environment unless you've written server-only code that specifically needs it. |

## Why there's no `DATABASE_URL` or direct Postgres connection string

The app never connects to Postgres directly -- every read/write goes
through `@supabase/supabase-js` / `@supabase/ssr` over Supabase's REST
(PostgREST) and Auth APIs, using the two `NEXT_PUBLIC_*` keys above. Row
Level Security (see `DATABASE.md`) is the actual security boundary, not
network-level database access control, so a raw connection string is
never needed by the application itself.

## Local vs. production values

Only `NEXT_PUBLIC_SITE_URL` should differ between environments
(`http://localhost:3000` locally, your real domain in production) --
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` should point at
the **same** Supabase project in both, unless you deliberately run a
separate staging project (recommended once you have real players, so
local development and testing don't touch live game sessions, prize
inventory, or winner records).

## Verifying your setup

`.env.local` isn't loaded until you (re)start the dev server -- after
editing it, stop and rerun `npm run dev`, then load `/login` in the
browser. If a required variable is missing or wrong, the Supabase client
fails to initialize and you'll see the error immediately in the browser
console (and the terminal running `next dev`), rather than a silent
failure.
