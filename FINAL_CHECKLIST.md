# Final Checklist

A short, practical pass through everything that needs to be true before
(and right after) this goes live. For the detailed "how," see
`DEPLOYMENT.md`; for environment variables, see `ENVIRONMENT.md`; for the
full architecture record, see `PROJECT_SPEC.md`.

## Database

- [ ] All 40 migrations in `supabase/migrations/` applied, in order (`supabase db push`, or one-by-one via the SQL Editor) -- includes a fix for a `game_questions_public` view migration that would otherwise fail on a fresh database (Section 21 of `PROJECT_SPEC.md`)
- [ ] **Anonymous sign-ins enabled** in Supabase Authentication -> Settings (required for `/play` to work at all)
- [ ] `prize-images` and `game-images` Storage buckets exist (created automatically by the migrations -- confirm in Storage tab)
- [ ] First `super_admin` row inserted via the service_role key (`DEPLOYMENT.md` Step 4)
- [ ] Logged in at `/login` with that admin account successfully

## Environment variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set (matches your Supabase project)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production URL (not `localhost`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` **not** set anywhere the browser can reach it (not a `NEXT_PUBLIC_*` var)

## Build & code health

- [ ] `npm run type-check` -- zero errors
- [ ] `npm run lint` -- zero errors
- [ ] `npm run build` -- succeeds
- [ ] No unresolved imports (verified this phase: 0 across 145 files)
- [ ] No orphaned/broken internal links (verified this phase: every `Link`/`redirect`/`router.push` target matches a real route)
- [ ] No undocumented duplicate components (verified this phase: `SpinWheelGame.tsx` and the `site/Wheel.tsx` re-export shim, both previously kept because this environment couldn't delete files, were removed this phase along with their now-direct imports -- see Section 21 of `PROJECT_SPEC.md`)
- [ ] No leftover `TODO`/`FIXME`/placeholder logic (verified this phase: none found; the "coming soon" admin stub pages -- Sessions, Settings, Activity Logs, Admins -- are honest, intentional stubs for not-yet-built phases, not broken features; Analytics is no longer a stub, see below)
- [ ] `npm install` picked up the new `recharts` dependency (Analytics charts) without error -- if npm complains about a `react-is` peer conflict under React 19, re-run with `--legacy-peer-deps`

## Content

- [ ] 23 games seeded and playable: Decoder, Guess the Gibberish, Name It to Win It, Logo Challenge, Chemical Symbol Challenge, True or False, Guess the Unit, Measurement Challenge, Equipment Match, Which Laboratory, Hazard Symbol, Odd One Out, Word Scramble, Emoji Science, Picture Puzzle, Memory Challenge, Spot the Difference, PPE Challenge, Calibration Challenge, Science Bingo, Science Facts, Mini Crossword, Wheel of Science Facts
- [ ] Spot-checked the 16 rows flagged `-- REVIEW (low confidence)` in `20260711020000_seed_puzzle_games.sql` (13 Decoder, 3 Guess the Gibberish) and corrected any that are wrong via Admin > Games
- [ ] Replaced (or scheduled replacing) the placeholder images for Name It to Win It, Logo Challenge, Hazard Symbol, Picture Puzzle, Memory Challenge, Spot the Difference, and PPE Challenge with real, licensed assets via Admin > Games > Questions
- [ ] At least one real prize exists and is `is_active = true` with stock, so the Prize Wheel isn't empty
- [ ] `quiz` and/or `spin_wheel` game instances created via Admin > Games if you want those two types live (they have no seeded instance by default)

## End-to-end smoke test (do this against the live URL)

- [ ] `/` loads, both homepage wheels render
- [ ] `/play` completes a full round: Start -> challenge -> reveal -> Prize Wheel spin -> Claim form -> Thank You screen
- [ ] A completed play shows up in Admin > Winners
- [ ] Admin > Games > CSV import: download template, edit it, re-upload, preview, confirm import works
- [ ] Admin > Prizes: create/edit a prize, upload an image, see it reflected on the public Prize Wheel
- [ ] Admin > Analytics: page loads with real numbers (not zeros, once at least one play has happened) -- Games Played, Correct/Incorrect Answers, Prizes Claimed, Most Popular Game, Low Stock Prizes cards, plus the Daily Participation/Most Popular Games/Answer Accuracy charts and the inventory table

## Post-launch

- [ ] Bookmark `PROJECT_SPEC.md` Section 20 (Roadmap) -- it lists everything intentionally not built yet (Sessions/Settings/Activity Logs/Admins UI, `claw_machine`/`scratch_card`/`slot_machine`), so nothing there should be mistaken for a bug
- [ ] Decide whether to run a separate Supabase project for staging vs. production before real players start generating real `game_sessions`/`winner_records`
