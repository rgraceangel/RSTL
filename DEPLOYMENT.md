# Deployment Guide

This is the step-by-step guide to take this app from a checked-out
repository to a live, working production deployment. Follow it in order --
each step depends on the one before it.

See also: `ENVIRONMENT.md` (every environment variable, explained) and
`FINAL_CHECKLIST.md` (a shorter pre-launch/post-launch checklist you can
tick through quickly).

---

## 1. Prerequisites

- Node.js **18.18 or newer** (see `package.json#engines`)
- A [Supabase](https://supabase.com) account and a new project (free tier
  is enough to start)
- A hosting target for Next.js -- these instructions use **Vercel**
  (simplest for Next.js), but any host that runs `next build && next start`
  works identically
- The [Supabase CLI](https://supabase.com/docs/guides/cli) installed
  locally (`npm install -g supabase`), for running migrations

---

## 2. Create the Supabase project

1. In the Supabase dashboard, create a new project. Note the **Project
   URL** and **anon public key** (Project Settings -> API) -- you'll need
   both for environment variables in Step 5.
2. Note the **service_role key** from the same page too. It is only ever
   needed for one manual step (bootstrapping the first admin, Step 4) and
   is never used by the running application -- do not put it in Vercel's
   environment variables or any client-reachable config.

---

## 3. Run the database migrations

All schema, RLS policies, views, RPCs, storage buckets, and seed data live
in `supabase/migrations/` (40 files, applied in filename/timestamp order --
never reorder or edit an already-applied migration). A full test/audit
pass (`PROJECT_SPEC.md` Section 21) found and fixed a real bug in this
chain: an earlier `game_questions_public` view migration would have failed
outright on a fresh `supabase db push` (PostgreSQL rejects
`CREATE OR REPLACE VIEW` when new columns are inserted mid-list rather
than appended at the end) -- a later migration in this same set corrects
it, so pushing all 40 in order now works end to end.

From the project root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This single command creates every table, RLS policy, trigger, view, RPC
function, and the two Storage buckets (`prize-images`, `game-images`) --
nothing needs to be created manually in the Supabase dashboard. It also
runs the seed migrations, which insert:

- Default `settings` rows (Section 12 / `20260709011600_seed_settings.sql`)
- 23 fully playable games with real content: Decoder (72 rounds), Guess the
  Gibberish (80 rounds), Chemical Symbol Challenge (15), True or False
  (15), Guess the Unit (15), Measurement Challenge (12), Equipment Match
  (20), Which Laboratory (15), Hazard Symbol (9), Odd One Out (15), Word
  Scramble (20), Emoji Science (20), Picture Puzzle (10), Memory Challenge
  (12), Spot the Difference (10), PPE Challenge (10), Calibration
  Challenge (15), Science Bingo (15), Science Facts (20), Mini Crossword
  (15), and Wheel of Science Facts (15) are real,
  fact-checked/directly-authored content. Name It to Win It (8) and Logo
  Challenge (8) ship with clearly-watermarked **sample/placeholder
  images**, and Hazard Symbol (9), Picture Puzzle (10), Memory Challenge
  (12), Spot the Difference (10), and PPE Challenge (10) all use original
  generated sample icons (not photos, not official GHS pictograms) --
  replace all of these with your own via Admin > Games once the site is
  live (see Section 16c/16d/16e/16f/16g in `PROJECT_SPEC.md` for exactly
  what's real vs. sample, and which Decoder/Gibberish answers are flagged
  `-- REVIEW` for a quick sanity check).

If you'd rather apply migrations by hand (e.g. no CLI access), open each
file in `supabase/migrations/` in the Supabase SQL Editor in filename
order and run it.

**Required Auth setting:** in the Supabase dashboard, go to
**Authentication -> Settings** and enable **Allow anonymous sign-ins**.
Player sessions (`/play`) sign visitors in anonymously so their
`game_sessions`/`winner_records` rows can be tied to `auth.uid()` under
RLS -- without this setting, every play attempt fails closed with a
friendly "Could not start a session" error rather than crashing, but no
one will actually be able to play.

---

## 4. Bootstrap the first admin

Every write policy on the `admins` table requires an existing
`super_admin` to already exist, which means the very first admin row
can't be created through the normal app UI -- there's no one to authorize
it yet. Create it once, directly, using the service_role key:

1. In Supabase, go to **Authentication -> Users** and create a user (email
   + password), or sign up through the app's `/login` page's underlying
   Supabase Auth (the login page itself doesn't have a public "sign up"
   button by design -- admins are provisioned, not self-registered).
2. Copy that user's UUID (`auth.users.id`).
3. In the Supabase **SQL Editor**, run:

   ```sql
   insert into public.admins (user_id, full_name, email, role)
   values ('<paste the auth.users.id here>', 'Founding Admin', 'you@example.com', 'super_admin');
   ```

4. Log in at `/login` with that account. You now have full `super_admin`
   access and can invite/manage other admins once that UI ships (Section
   20, Phase 11 -- not built yet), or repeat this SQL step for additional
   admins in the meantime.

---

## 5. Configure environment variables

See `ENVIRONMENT.md` for the full reference. In short, copy
`.env.local.example` to `.env.local` for local development:

```bash
cp .env.local.example .env.local
```

and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key from Step 2>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` in the example file is a placeholder for your
own future scripts (analytics aggregation jobs, admin bootstrap
automation, etc.) -- the running app never reads it, so it's fine to leave
it blank for local dev. **Do not set it in Vercel's dashboard** unless you
specifically add server-only code that needs it; if you do, keep it out of
any `NEXT_PUBLIC_*` variable so it's never shipped to the browser.

---

## 6. Local verification (recommended before deploying)

```bash
npm install
npm run type-check   # tsc --noEmit -- should report zero errors
npm run lint
npm run build         # production build -- catches anything type-check misses
npm run dev           # http://localhost:3000
```

`npm install` now also pulls in `recharts` (Admin > Analytics' charts,
Section 19 of `PROJECT_SPEC.md`) -- if npm reports a `react-is` peer
conflict under React 19, re-run as `npm install --legacy-peer-deps`.

Verify locally before deploying:

- `/` loads and the two homepage wheels render
- `/login` -> sign in with your bootstrapped admin -> lands on `/admin`
- `/admin/games` lists the 23 seeded games
- `/play` loads a random game end-to-end (Start -> challenge -> reveal ->
  Prize Wheel -> Claim -> Thank You)

---

## 7. Deploy to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket and import it in
   [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `next build` (default). Output directory: default.
4. Add the environment variables from Step 5 in **Project Settings ->
   Environment Variables** (Production, and Preview if you want preview
   deployments to work against the same Supabase project):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your real production URL, e.g.
     `https://yourdomain.com`)
5. Deploy. Vercel builds and serves the app; every subsequent push to your
   production branch redeploys automatically.

Any other Node host works the same way in principle: run `npm run build`,
then `npm run start`, with the same three environment variables set in
that host's environment/secrets configuration.

---

## 8. Post-deploy verification

Repeat the checks from Step 6 against the live URL, plus:

- Confirm `next/image` is actually optimizing/serving images (both the
  local `/game-assets/**` files and any `*.supabase.co` Storage URLs --
  `next.config.ts` already whitelists `**.supabase.co` via
  `images.remotePatterns`, and local `public/` paths need no
  configuration).
- Play through the 23 seeded games at least once each -- Decoder, Guess the
  Gibberish, Name It to Win It, Logo Challenge, Chemical Symbol Challenge,
  True or False, Guess the Unit, Measurement Challenge, Equipment Match,
  Which Laboratory, Hazard Symbol, Odd One Out, Word Scramble, Emo