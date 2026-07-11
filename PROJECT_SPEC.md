# PROJECT_SPEC.md

**Status:** Living document — single source of truth for this codebase.
**Last updated through:** Section 16g -- Calibration Challenge, Science Bingo, Science Facts, Mini Crossword, and Wheel of Science Facts added (25 of 28 `game_type`s now playable); full project audit re-run and passing.
**Rule for all future work:** read this document first, extend the existing
files/modules it describes, and update this document whenever a phase adds
or changes architecture. Do not recreate a file or pattern that already
exists here — extend it.

---

## 1. Project Overview and Objectives

This is a single production-ready **Next.js application** for running
prize-based games (quizzes, spin wheels, claw machines, scratch cards, slot
machines) with a full back-office admin panel on top of **Supabase**
(Postgres + Auth + Storage).

Two audiences, two halves of the app:

- **Admins** (this is what's built so far): sign in, configure games and
  prizes, track inventory, and will eventually manage winners, view
  analytics, and moderate activity — all under `/admin`.
- **Players**: `/play` now runs a single reusable **Game Engine**
  (Section 16b/16c/16d/16e/16f/16g) that every playable game goes through:
  Title -> Mechanics -> Start -> a type-specific challenge -> Reveal ->
  Prize Wheel -> Claim -> Thank You. Twenty-five of twenty-eight
  `game_type`s have a real challenge implemented -- `quiz`, `decoder`,
  `guess_the_gibberish`, `name_it_to_win_it`, `logo_challenge`,
  `chemical_symbol_challenge`, `true_or_false`, `guess_the_unit`,
  `measurement_challenge`, `equipment_match`, `which_laboratory`,
  `hazard_symbol`, `odd_one_out`, `word_scramble`, `emoji_science`,
  `picture_puzzle`, `memory_challenge`, `spot_the_difference`,
  `ppe_challenge`, `calibration_challenge`, `science_bingo`,
  `science_facts`, `mini_crossword`, and `wheel_of_science_facts` all share
  one "random question + countdown timer + sound + server-checked answer"
  challenge (the only differences are the question's `question_type` --
  multiple_choice/true_false/text -- whether it carries an image, and/or a
  category tag); `spin_wheel` has no separate challenge, the wheel spin
  itself is both challenge and reward. `claw_machine`/`scratch_card`/
  `slot_machine` show an honest "not built yet" state. Every stage writes
  real data: a real `game_sessions` row, a real weighted +
  availability-checked `winner_records` insert, and a real
  player-submitted claim (Section 17). The public homepage's Game Wheel /
  Prize Wheel (Section 7c) remains a separate, front-end-only preview — it
  still never writes a `game_session` or `winner_records` row.

Objectives guiding every phase:

- **Production-ready from the start** — real RLS policies, real triggers,
  typed Supabase client, no throwaway scaffolding.
- **Incremental, non-destructive builds** — each phase extends the existing
  codebase; nothing already working gets rebuilt.
- **Security by default** — Postgres Row Level Security is the ultimate
  gate on every table; application code (middleware, server-side
  `requireAdmin`/`requireRole`) is a fast, user-friendly second layer, never
  the only one.
- **Modular, typed, reusable** — shared UI primitives, typed Supabase
  queries, shared validation schemas, no copy-pasted logic.

### Phases completed so far

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Project architecture scaffold (Next.js, Tailwind, folder structure) | Done |
| 2 | Full Supabase database design + SQL migrations | Done |
| 3 | Authentication (admin login, sessions, middleware, roles) | Done |
| 4 | Admin dashboard (sidebar, cards, analytics cards, responsive shell) | Done |
| 5 | Prize management (CRUD, inventory, image upload, availability, search, pagination) | Done |
| 6 | Winners management (form, validation, search, filters, CSV/Excel export, print, prize-history timeline) | Done |
| 7 | Game management (enable/disable, timers, question CRUD + reorder, image upload, CSV bulk import, preview) | Done |
| 7c | Public homepage (science theme, animations, Game Wheel + Prize Wheel locked until success, responsive) | Done |
| 12a | Real player Spin Wheel engine (Section 16a) — anonymous auth, real session + weighted/available-prize draw, sound effects | Done (superseded by 12b's unified engine, kept working) |
| 12b | Unified Game Engine (Section 16b) — one reusable engine for every game type: Title/Mechanics/Start, Quiz challenge (random question, countdown timer + sound, reveal answer), Prize Wheel, real player Claim flow, Thank You | Done (quiz + spin_wheel types; claw_machine/scratch_card/slot_machine show a "not built yet" state) |
| 12c | Decoder, Guess the Gibberish, Name It to Win It (Section 16c) — 3 new `game_type`s added to the Game Engine's question-based challenge, `game_questions.category` column, real Decoder/Gibberish content seeded (72 + 80 rounds), sample Name It to Win It content | Done (12b's engine shell, extended) |
| 12d | Logo Challenge, Chemical Symbol Challenge, True or False, Guess the Unit, Measurement Challenge (Section 16d) — 5 more `game_type`s through the same engine shell; real, fact-checked content seeded for 4 of the 5, sample content for Logo Challenge | Done (12b's engine shell, extended again) |
| — | Full project audit (routes, imports, duplicate components, placeholder logic) + `DEPLOYMENT.md`/`ENVIRONMENT.md`/`FINAL_CHECKLIST.md` | Done |
| 12e | Equipment Match, Which Laboratory, Hazard Symbol, Odd One Out, Word Scramble (Section 16e) — 5 more `game_type`s through the same engine shell; all real, directly-authored content (79 questions total), including the first `multiple_choice` seed content in the project; 9 original sample hazard icons | Done (12b's engine shell, extended a third time) |
| — | Full project audit re-run (routes, imports, duplicate components, placeholder logic, slug/image-reference integrity) | Done |
| 12f | Emoji Science, Picture Puzzle, Memory Challenge, Spot the Difference, PPE Challenge (Section 16f) — 5 more `game_type`s through the same engine shell; all real, directly-authored content (62 questions total); 42 original sample images generated from a new shared icon library (`scripts/icon_lib.py`) | Done (12b's engine shell, extended a fourth time) |
| — | Full project audit re-run (routes, imports, duplicate components, placeholder logic, slug/image-reference integrity) | Done |
| 12g | Calibration Challenge, Science Bingo, Science Facts, Mini Crossword, Wheel of Science Facts (Section 16g) — 5 more `game_type`s through the same engine shell; all real, directly-authored content (80 questions total); no new images -- pure text/multiple_choice/true_false rounds | Done (12b's engine shell, extended a fifth time) |
| — | Full project audit re-run (routes, imports, duplicate components, placeholder logic, slug integrity) | Done |
| 8+ | See Section 20 — Sessions, Settings, Analytics UI, remaining game-engine types (claw_machine/scratch_card/slot_machine) | Not started |

---

## 2. Technology Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | `next.config.ts`, Server Components by default |
| UI library | React 19 | Server + Client Components, Server Actions |
| Language | TypeScript (strict) | Path alias `@/*` → `src/*` |
| Styling | Tailwind CSS 3 | CSS-variable design tokens, no component library (shadcn not installed) |
| Backend/DB | Supabase (Postgres, Auth, Storage) | `@supabase/supabase-js` + `@supabase/ssr` |
| Animation | Framer Motion | Mobile menus, drawers, entrance transitions |
| Forms | React Hook Form + `@hookform/resolvers/zod` | Every form in the app |
| Validation | Zod | Client + server (defense in depth), schemas shared |
| Icons | lucide-react | Only icon set used |
| Class utilities | clsx + tailwind-merge (`cn()`) | `src/lib/utils.ts` |
| Server-only guard | `server-only` package | Marks modules that must never bundle client-side |

No state-management library (Redux/Zustand/React Query) is installed —
see Section 11 for why.

---

## 3. Complete Folder and File Structure

```
.
├── .env.local.example
├── PROJECT_SPEC.md            ← this file
├── DATABASE.md                 Database design reference (superseded in scope by Section 4 below, kept as-is)
├── AUTH.md                     Auth flow reference (superseded in scope by Section 5 below, kept as-is)
├── README.md                   Stack + getting-started
├── DEPLOYMENT.md                Step-by-step production deployment guide
├── ENVIRONMENT.md                Every environment variable, explained
├── FINAL_CHECKLIST.md            Pre-/post-launch checklist
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.js
├── .eslintrc.json
│
├── public/                     Static assets
│   └── game-assets/             Real/sample game images (Section 16c/16d/16e/16f), served locally -- not Supabase Storage
│       ├── decoder/              01.png .. 72.png (real rebus images from the uploaded deck)
│       ├── name-it-to-win-it/    8 sample/placeholder category icons, watermarked "SAMPLE IMAGE"
│       ├── logo-challenge/       8 sample/placeholder brand icons, watermarked "SAMPLE LOGO"
│       ├── hazard-symbol/        9 original sample hazard-class icons, watermarked "SAMPLE ICON" (not official GHS pictograms)
│       ├── picture-puzzle/       10 original two-icon compound-word puzzle images, watermarked "SAMPLE IMAGE"
│       ├── memory-challenge/     12 original 4-icon row images, watermarked "SAMPLE IMAGE"
│       ├── spot-the-difference/  10 original two-panel comparison images, watermarked "SAMPLE IMAGE"
│       └── ppe-challenge/        10 original PPE item icons, watermarked "SAMPLE IMAGE"
│
├── scripts/                    Python one-off generator scripts (seed content SQL, sample images) -- dev tooling only, not imported by or bundled into the Next.js app
│   ├── icon_lib.py               Shared ~40-function icon-drawing library (Section 16f), reusable for future image-based game types
│   ├── gen_hazard_icons.py       One-off generator for the 9 Hazard Symbol icons (Section 16e)
│   ├── gen_seed_16e_full.py      One-off seed-SQL generator for Section 16e's 5 games
│   ├── gen_16f_images.py         One-off generator for the 42 Section 16f images (uses icon_lib.py)
│   ├── gen_seed_16f_full.py      One-off seed-SQL generator for Section 16f's 5 games
│   └── gen_seed_16g_full.py      One-off seed-SQL generator for Section 16g's 5 games (no images this phase)
│
├── supabase/
│   └── migrations/              36 SQL files, see Section 4
│
└── src/
    ├── middleware.ts            Root middleware entry (delegates to lib/supabase/middleware.ts)
    │
    ├── app/
    │   ├── layout.tsx           Root layout: fonts, globals.css, SupabaseProvider (session-aware)
    │   ├── globals.css          Tailwind directives + CSS variable design tokens
    │   │
    │   ├── (site)/               Route group: public marketing site
    │   │   ├── layout.tsx         Wraps children in MainLayout (Navbar + Footer)
    │   │   └── page.tsx            Public home page — DONE (science-theme hero, Game/Prize wheels, how-it-works, recent winners)
    │   │
    │   ├── (auth)/                Route group: chrome-free auth screens
    │   │   ├── layout.tsx          Centered shell, no nav/footer
    │   │   └── login/page.tsx       Admin sign-in page
    │   │
    │   ├── (play)/                 Route group: chrome-free real player experience — DONE (Section 16b)
    │   │   ├── layout.tsx           SoundProvider + minimal header (Logo, back link, mute toggle)
    │   │   └── play/page.tsx         Random active quiz/spin_wheel game -> renders GameEngine
    │   │
    │   └── admin/                 Protected admin area (requireAdmin() in layout.tsx)
    │       ├── layout.tsx           requireAdmin() + AdminProvider + AdminShell
    │       ├── page.tsx              Dashboard (cards, analytics, recent lists) — DONE
    │       ├── games/                 Game management — DONE (Phase 7)
    │       │   ├── page.tsx              List: search + status filter + pagination + table
    │       │   ├── new/page.tsx           Create form
    │       │   └── [id]/
    │       │       ├── page.tsx            Edit form (details) + game-level Images manager
    │       │       ├── preview/page.tsx     Read-only admin preview (banner + all questions in order)
    │       │       └── questions/
    │       │           ├── page.tsx              List: reorder (up/down) + add + bulk import links
    │       │           ├── new/page.tsx           Add one question
    │       │           ├── [questionId]/page.tsx   Edit one question
    │       │           └── import/page.tsx          CSV bulk import: upload -> preview -> confirm
    │       ├── prizes/                Prize management — DONE (Phase 5)
    │       │   ├── page.tsx            List: search + pagination + table
    │       │   ├── new/page.tsx         Create form
    │       │   └── [id]/page.tsx        Edit form
    │       ├── winners/                Winners management — DONE (Phase 6)
    │       │   ├── page.tsx              List: search + filters + export + print + pagination
    │       │   ├── new/page.tsx           Manually record a win (existing session + prize)
    │       │   ├── [id]/page.tsx           Detail: edit form + Prize History timeline
    │       │   └── export/
    │       │       ├── csv/route.ts          GET -> CSV download (Route Handler, see Section 9)
    │       │       └── xlsx/route.ts          GET -> Excel download (Route Handler, see Section 9)
    │       ├── sessions/page.tsx       Placeholder — future phase
    │       ├── analytics/page.tsx      Placeholder — future phase
    │       ├── activity-logs/page.tsx  Placeholder — future phase
    │       ├── settings/page.tsx       Placeholder — future phase
    │       └── admins/page.tsx         Placeholder, super_admin-gated — future phase
    │
    ├── components/
    │   ├── layout/                 Public-site chrome
    │   │   ├── MainLayout.tsx        Navbar + main + Footer wrapper
    │   │   ├── Navbar.tsx             Sticky responsive nav
    │   │   ├── MobileMenu.tsx         Framer Motion mobile nav panel
    │   │   ├── Footer.tsx
    │   │   └── Container.tsx          Max-width content wrapper
    │   │
    │   ├── ui/                     Generic, page-agnostic primitives
    │   │   ├── Button.tsx             Variant/size button
    │   │   ├── Input.tsx
    │   │   ├── Label.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── Select.tsx             Native select, styled, chevron icon
    │   │   ├── Switch.tsx             Toggle control (availability, etc.)
    │   │   ├── Logo.tsx
    │   │   └── Wheel.tsx               Generic reusable SVG spinning-wheel primitive (moved here from site/, Section 16a — now shared by site/ and play/)
    │   │
    │   ├── site/                    Public homepage sections (Phase: Public Homepage)
    │   │   ├── Hero.tsx                Science-theme hero, entrance animations, anchor CTAs
    │   │   ├── ScienceBackground.tsx    Reusable ambient floating-icon backdrop
    │   │   ├── SectionHeading.tsx       Plain eyebrow/title/subtitle header, server-safe
    │   │   ├── WheelArena.tsx           Owns the Game<->Prize Wheel "unlocked" state, lays out both
    │   │   ├── GameWheel.tsx            Spin-to-advance wheel (fixed science-category wedges)
    │   │   ├── PrizeWheel.tsx           Locked-until-success wheel (live prize catalog or fallback)
    │   │   ├── HowItWorks.tsx           4-step explainer, staggered scroll-in animation
    │   │   └── RecentWinners.tsx        Public "recent winners" feed, fed by `recent_winners_feed` view
    │   │
    │   ├── play/                    Real player Game Engine components (Section 16a/16b)
    │   │   ├── GameEngine.tsx          THE reusable engine -- stage state machine every playable game runs through
    │   │   ├── GameIntro.tsx           Title + Mechanics + Start button
    │   │   ├── QuizChallenge.tsx       Random question + countdown timer/sound + answer input
    │   │   ├── CountdownTimer.tsx      Generic countdown bar, reusable, keyed per-question to reset
    │   │   ├── AnswerReveal.tsx        Reveal answer + You Got It/Try Again + stage Navigation
    │   │   ├── PrizeStage.tsx          Prize Wheel stage -- wraps ui/Wheel.tsx + spinForPrizeAction
    │   │   ├── ClaimForm.tsx           Claim flow -- RHF+Zod, calls claimPrizeAction
    │   │   ├── ThankYouScreen.tsx      Final confirmation + Play Again
    │   │   └── SoundToggle.tsx         Mute/unmute button, reads useSound()
    │   │
    │   ├── providers/               React context providers
    │   │   ├── SupabaseProvider.tsx    Browser Supabase client + reactive session
    │   │   ├── AdminProvider.tsx        Signed-in admin profile, scoped to /admin
    │   │   └── SoundProvider.tsx        Mute flag (localStorage) + synthesized sound-effect dispatch, mounted in (play)/layout.tsx only
    │   │
    │   ├── auth/
    │   │   └── LoginForm.tsx          RHF+Zod login form, calls loginAction
    │   │
    │   └── admin/                   Admin-area components
    │       ├── AdminShell.tsx          Composes sidebar + topbar + content, responsive
    │       ├── AdminSidebar.tsx        Persistent desktop / off-canvas mobile nav
    │       ├── AdminTopbar.tsx         Mobile menu button + admin identity + logout
    │       ├── LogoutButton.tsx
    │       ├── RoleGate.tsx            Conditionally renders children by admin role
    │       ├── StatCard.tsx            Dashboard/analytics stat card
    │       ├── SearchInput.tsx         Debounced, URL-synced search box (reusable)
    │       ├── Pagination.tsx          URL-synced prev/next pager (reusable)
    │       ├── prizes/                 Prize-management-specific components
    │       │   ├── PrizeForm.tsx          Create/edit form (name, type, value, image, stock, availability)
    │       │   ├── PrizeImageUpload.tsx   Thin wrapper around admin/ImageUpload.tsx (bucket="prize-images")
    │       │   ├── PrizeTable.tsx         List table (image, type, value, stock, status)
    │       │   └── PrizeRowActions.tsx    Availability toggle, inline restock, edit link, delete confirm
    │       ├── winners/                Winners-management-specific components
    │       │   ├── WinnerFilters.tsx       Search + status/game/prize/date-range filters, URL-synced
    │       │   ├── WinnersTable.tsx        List table (player, prize, game, won date, status)
    │       │   ├── WinnerRowActions.tsx    View link, mark claimed, cancel, delete confirm
    │       │   ├── WinnerCreateForm.tsx    "Record Win" form (pick session + prize, optional contact info)
    │       │   ├── WinnerEditForm.tsx      Edit contact info + status transition
    │       │   ├── WinnerTimeline.tsx      "Prize History": won/claimed/cancelled timeline + linked prize/session
    │       │   └── ExportButtons.tsx       CSV / Excel export links + Print trigger, filter-aware
    │       ├── ImageUpload.tsx           Generic, bucket-parameterized Storage uploader (shared by prizes/games)
    │       └── games/                  Game-management-specific components
    │           ├── GameForm.tsx            Metadata + default timer + advanced JSON config + thumbnail
    │           ├── GamesTable.tsx          List table (thumbnail, type, image count, status)
    │           ├── GameRowActions.tsx      Enable/disable switch (active<->paused), preview/questions/edit links, delete
    │           ├── GameStatusFilter.tsx    Status dropdown filter, URL-synced
    │           ├── GameImagesManager.tsx   Game-level image grid (banner/thumbnail/background/icon) + uploader
    │           ├── QuestionsList.tsx       Ordered question list with up/down reorder (calls move_game_question RPC)
    │           ├── QuestionForm.tsx        Question editor: type-conditional fields, dynamic options (useFieldArray), timer
    │           ├── CsvImportForm.tsx       File picker -> preview -> confirm bulk-import flow, template download
    │           ├── CsvImportPreviewTable.tsx  Per-row validity display before committing an import
    │           └── GamePreview.tsx         Read-only render of a game + all questions, correct answers highlighted
    │
    ├── hooks/
    │   ├── useSupabase.ts            Access { supabase, session } from context
    │   ├── useAdmin.ts                Access signed-in AdminProfile from context
    │   ├── useSound.ts                 Access mute flag + sound dispatchers from context (Section 16a/16b)
    │   ├── useMediaQuery.ts
    │   ├── useMounted.ts
    │   └── index.ts                    Barrel export
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts                Browser Supabase client (typed, `@supabase/ssr`)
    │   │   ├── server.ts                 Server Supabase client (Server Components/Actions)
    │   │   └── middleware.ts             Session refresh + route-protection logic
    │   │
    │   ├── auth/
    │   │   ├── session.ts                getCurrentAdmin / requireAdmin / requireRole (server-only)
    │   │   ├── roles.ts                   hasRole / hasMinimumRole
    │   │   └── actions.ts                 loginAction, logoutAction (Server Actions)
    │   │
    │   ├── actions/
    │   │   ├── prizes.ts                  createPrizeAction, updatePrizeAction, deletePrizeAction,
    │   │   │                              toggleAvailabilityAction, restockPrizeAction
    │   │   ├── winners.ts                  createWinnerAction, updateWinnerAction, markClaimedAction,
    │   │   │                              markExpiredAction, cancelWinAction, deleteWinnerAction
    │   │   ├── game-sessions.ts            startGameSessionAction, spinForPrizeAction, claimPrizeAction --
    │   │   │                              anonymous-callable, shared by every game type (Section 16a/16b)
    │   │   └── quiz.ts                     getRandomQuestionAction, submitQuizAnswerAction -- quiz-only
    │   │                                  pieces of the Game Engine (Section 16b)
    │   │
    │   ├── queries/
    │   │   ├── dashboard.ts               getDashboardStats, getRecentWinners, getRecentActivity
    │   │   ├── prizes.ts                   listPrizes (search+pagination), getPrizeById
    │   │   ├── winners.ts                  listWinnerRecords (search+filters+pagination),
    │   │   │                              listWinnerRecordsForExport, getWinnerDetail,
    │   │   │                              getGameOptions, getActivePrizeOptions, getRecentCompletedSessions
    │   │   ├── public.ts                   getActivePrizesForWheel, getRecentWinnersFeed -- anonymous-safe reads
    │   │   │                              for the public homepage (no admin session assumed)
    │   │   └── play.ts                     getRandomActiveGame(gameTypes), getAvailablePrizesForWheel,
    │   │                                  getRandomQuestionForGame -- reads backing the real Game Engine
    │   │                                  (Section 16a/16b)
    │   │
    │   ├── validations/
    │   │   ├── common.ts                   emailSchema, passwordSchema, nameSchema
    │   │   ├── auth.ts                      loginSchema
    │   │   ├── prize.ts                     prizeSchema, restockSchema, PRIZE_TYPES
    │   │   ├── winner.ts                    winnerCreateSchema, winnerUpdateSchema, WINNER_STATUSES
    │   │   ├── claim.ts                     claimSchema (player_name, player_contact) -- Section 16b's Claim flow
    │   │   └── index.ts                     Barrel export
    │   │
    │   ├── csv.ts                          Generic toCsv() builder (reusable for any future export)
    │   ├── wheel.ts                        mod360() / computeSpinRotation() / scheduleSpinTicks() / WHEEL_SPIN_DURATION_MS
    │   │                                  -- shared by GameWheel, PrizeWheel, and Section 16b's PrizeStage
    │   ├── sound.ts                        Synthesized Web Audio API sound effects (spin/tick/win/error), no audio files
    │   ├── quiz.ts                         parseQuizOptions() / describeQuizAnswer() -- shared by QuizChallenge + GameEngine
    │   └── utils.ts                       cn() classname helper
    │
    ├── constants/
    │   ├── site.ts                       SITE_CONFIG (name, description, nav items)
    │   ├── auth.ts                        ROLE_HIERARCHY, ROLE_LABELS, ROLE_BADGE_STYLES, LOGIN_* paths
    │   ├── admin-nav.ts                   ADMIN_NAV_ITEMS (sidebar links, icons, role restrictions)
    │   ├── winners.ts                     WINNER_STATUS_LABELS, WINNER_STATUS_STYLES, WINNERS_PAGE_SIZE, WINNERS_EXPORT_LIMIT
    │   ├── prizes.ts                       PRIZE_TYPE_LABELS, PRIZES_PAGE_SIZE
    │   ├── home.ts                          HOME_HERO, WHEEL_COLORS, GAME_WHEEL_SEGMENTS, PRIZE_WHEEL_FALLBACK, HOW_IT_WORKS_STEPS
    │   └── index.ts                        Barrel export (re-exports all of the above)
    │
    └── types/
        ├── supabase.ts                    Hand-authored Database type (mirrors migrations exactly)
        └── index.ts                        NavItem, SiteConfig, WheelSegment, AdminProfile, AdminRole, re-exports
```

---

## 4. Database Schema, Relationships, and SQL Migrations

Full narrative reference: **`DATABASE.md`** (kept up to date alongside this
spec). Summary below; do not re-run or re-author these migrations — add new
ones for new phases.

### Tables (11)

`admins`, `games`, `game_questions`, `game_images`, `prizes`,
`prize_inventory`, `game_sessions`, `winner_records`, `analytics`,
`activity_logs`, `settings` — full column lists, checks, and defaults are in
each table's migration file and in `src/types/supabase.ts`. *(Section 19
addition: `game_sessions` gained an `answer_correct boolean` column so
Analytics can report correct/incorrect answers honestly — see Section 19.)*

### Relationships

- `admins.user_id` → `auth.users.id` (1:1)
- `games.created_by` → `admins.id`
- `game_questions.game_id` → `games.id`; `game_images.game_id` → `games.id`,
  `game_images.question_id` → `game_questions.id` (nullable)
- `prize_inventory.prize_id` → `prizes.id` (1:1)
- `game_sessions.game_id` → `games.id`; `game_sessions.player_id` →
  `auth.users.id` (anonymous sign-in supported)
- `winner_records.game_session_id` → `game_sessions.id`,
  `.game_id` → `games.id`, `.prize_id` → `prizes.id` (`on delete restrict`)
- `analytics.game_id` → `games.id` (nullable = global metric)
- `activity_logs.admin_id` → `admins.id`; `settings.updated_by` → `admins.id`

### Triggers

- **Automatic timestamping**: `set_updated_at()` on every table with an
  `updated_at` column; `handle_session_end()` stamps
  `game_sessions.ended_at`; `handle_winner_status_change()` stamps
  `winner_records.claimed_at`/`cancelled_at`.
- **Automatic inventory deduction**: `handle_prize_win()` (`BEFORE INSERT`
  on `winner_records`) locks the prize's inventory row, blocks the insert if
  out of stock, else decrements availability. `handle_prize_restock()`
  (`AFTER UPDATE OR DELETE`) restocks on cancellation/deletion.
- **Automatic prize deactivation** *(added in Phase 5)*:
  `handle_zero_stock_deactivation()` (`AFTER INSERT OR UPDATE` on
  `prize_inventory`) sets `prizes.is_active = false` the moment
  `quantity_available` reaches 0. Restocking does **not** auto-reactivate —
  an admin flips `is_active` back on deliberately after confirming stock.
- **Audit logging**: `log_activity()` writes to `activity_logs` on
  insert/update/delete of `games`, `game_questions`, `prizes`,
  `prize_inventory`, `winner_records`, `settings`.

### Row Level Security

Enabled on every table. `is_admin()` / `is_super_admin()` helper functions
(SQL, `SECURITY DEFINER`) drive most policies. Public/anon access is
limited to: active games, their images, active prizes, public settings, and
two safe views (`game_questions_public` — strips `correct_answer`;
`recent_winners_feed` — masks player names). Everything else is admin-only.
*(Phase 6 addition: a second `winner_records` INSERT policy lets an admin
record a win directly, alongside the original "player records their own
completed session" policy — Postgres ORs permissive policies together.)*
Full policy-by-policy breakdown is in `DATABASE.md` (current through Phase 5;
Phase 6's one additional policy is documented here and in its migration file).

### Storage *(added in Phase 5)*

- Bucket `prize-images` — public read, admin-only write (insert/update/delete
  gated by `is_admin()` via `storage.objects` RLS policies).

### Migrations (chronological, `supabase/migrations/`)

| File | Adds |
| --- | --- |
| `20260709010000_extensions.sql` | `pgcrypto`, `pg_trgm` |
| `20260709010100_function_set_updated_at.sql` | `set_updated_at()` |
| `20260709010200_admins.sql` | `admins` table |
| `20260709010300_admin_helper_functions.sql` | `is_admin()`, `is_super_admin()`, `current_admin_id()` |
| `20260709010400_games.sql` | `games` table |
| `20260709010500_game_questions.sql` | `game_questions` table |
| `20260709010600_game_images.sql` | `game_images` table |
| `20260709010700_prizes.sql` | `prizes` table |
| `20260709010800_prize_inventory.sql` | `prize_inventory` table |
| `20260709010900_game_sessions.sql` | `game_sessions` table + `handle_session_end()` |
| `20260709011000_winner_records.sql` | `winner_records` table + inventory deduction/restock triggers |
| `20260709011100_analytics.sql` | `analytics` table |
| `20260709011200_settings.sql` | `settings` table |
| `20260709011300_activity_logs.sql` | `activity_logs` table + `log_activity()` + attachments |
| `20260709011400_row_level_security.sql` | RLS enabled + all policies |
| `20260709011500_public_views.sql` | `game_questions_public`, `recent_winners_feed` |
| `20260709011600_seed_settings.sql` | Default `settings` rows |
| `20260709020000_admin_login_rpc.sql` | `record_admin_login()` RPC |
| `20260709030000_prize_images_storage.sql` | `prize-images` storage bucket + policies |
| `20260709030100_prize_auto_deactivation.sql` | `handle_zero_stock_deactivation()` |
| `20260709040000_admin_insert_winner_records.sql` | Additional `winner_records` INSERT policy so admins can record a win manually (Phase 6) |
| `20260709050000_game_images_storage.sql` | `game-images` storage bucket + policies (Phase 7, mirrors `prize-images`) |
| `20260709050100_move_game_question_rpc.sql` | `move_game_question()` RPC — atomic question reorder (Phase 7) |
| *(this table tracks the initial core-schema build only; every subsequent phase's migrations are listed in that phase's own numbered section below — 16a-16g for the Game Engine/content phases, 17 for Analytics)* | |
| `20260716010000_analytics_dashboard.sql` | `game_sessions.answer_correct` column + six admin-only Analytics RPCs (Section 19) |

---

## 5. Authentication Flow and User Roles

Full narrative reference: **`AUTH.md`**. Summary:

- **Provider**: Supabase Auth, email/password, admin-only for now.
- **Roles** (`admins.role`, hierarchy low→high): `moderator` < `admin` <
  `super_admin`. Defined in `src/constants/auth.ts` (`ROLE_HIERARCHY`),
  checked via `hasRole()` / `hasMinimumRole()` (`src/lib/auth/roles.ts`).
- **Login**: `LoginForm` (Client) → `loginAction` (Server Action,
  `src/lib/auth/actions.ts`) → validates → `signInWithPassword` → verifies
  an active `admins` row exists (signs back out if not) → calls
  `record_admin_login()` RPC → redirects into `/admin`.
- **Logout**: `LogoutButton` → `logoutAction` → `signOut()` → redirect to
  `/login`.
- **Route protection, two layers**:
  1. `src/middleware.ts` → `updateSession()` (edge-level): redirects
     anonymous/unauthorized requests away from `/admin/*`, redirects
     signed-in admins away from `/login`.
  2. `src/app/admin/layout.tsx` → `requireAdmin()` (authoritative,
     server-side, every render).
  3. Postgres RLS (last line of defense, independent of application code).
- **Role-gated pages/actions**: `requireRole([...])` for whole
  pages/Server Actions; `<RoleGate allowed={[...]}>` for partial UI. Prize
  management mutations require `admin` or `super_admin` (moderators get
  read-only); the `/admin/admins` page requires `super_admin`.
- **Session management**: middleware refreshes the session cookie every
  request; `SupabaseProvider` is seeded with the server session and
  re-syncs via `supabase.auth.onAuthStateChange()`, calling
  `router.refresh()` on sign-in/out so server-rendered admin UI stays
  current.
- **Bootstrapping**: the first `super_admin` must be inserted with the
  `service_role` key (see `DATABASE.md`), since normal RLS requires an
  existing super admin to create another.

---

## 6. Admin Dashboard Architecture and Completed Modules

- **Shell** (`AdminShell.tsx`): composes `AdminSidebar` (persistent on
  desktop, off-canvas drawer on mobile via Framer Motion) + `AdminTopbar`
  (mobile menu button, admin name/role badge, logout) + a `<main>` content
  slot.
- **Navigation** (`AdminSidebar.tsx` + `constants/admin-nav.ts`): nine
  sections (Dashboard, Games, Prizes, Winners, Sessions, Analytics,
  Activity Logs, Settings, Admins), active-link highlighting via
  `usePathname()`, role-filtered (Admins link is `super_admin`-only).
- **Dashboard page** (`app/admin/page.tsx`, DONE): two `StatCard` grids —
  *Overview* (Active Games, Sessions Today, Prizes Won Today, Low Stock
  Prizes) and *Analytics* (Completed Sessions, Win Rate, Prize Value
  Awarded, Average Score) — plus *Recent Winners* and *Recent Activity*
  panels. All data is fetched live from Postgres via
  `src/lib/queries/dashboard.ts` (no mock data).
- **Completed modules**: Authentication (Phase 3), Dashboard (Phase 4),
  Prize Management (Phase 5). Everything else under `/admin/*` is a
  "coming soon" placeholder page (see Section 3's route tree).

---

## 7. Prize Management Architecture

Located at `/admin/prizes`. Fully wired to Postgres — no mock data.

- **CRUD**: list (`page.tsx`), create (`new/page.tsx`), edit
  (`[id]/page.tsx`). Reads via `src/lib/queries/prizes.ts`
  (`listPrizes`, `getPrizeById`); writes via `src/lib/actions/prizes.ts`
  (`createPrizeAction`, `updatePrizeAction`, `deletePrizeAction`). All
  mutations require `requireRole(['admin', 'super_admin'])`.
- **Inventory**: creating a prize also creates its `prize_inventory` row
  (`quantity_total`, `low_stock_threshold`). Ongoing stock changes go
  through `restockPrizeAction` (adds to `quantity_total`, stamps
  `last_restocked_at`) rather than the edit form, keeping "catalog edit"
  and "stock movement" as distinct, auditable operations.
- **Image upload**: `PrizeImageUpload.tsx` uploads directly from the
  browser to the `prize-images` Supabase Storage bucket using the
  browser Supabase client, then stores the resulting public URL on the
  prize. Validates file type (png/jpeg/webp/gif) and size (≤5MB)
  client-side; storage RLS enforces admin-only writes server-side.
- **Availability**: `is_active` toggle (`Switch` component) in both the
  row actions and the form. Automatically flipped off by the
  `handle_zero_stock_deactivation()` trigger when stock hits zero (see
  Section 4) — this is enforced in the database, not just in the UI.
- **Search**: `SearchInput.tsx` — debounced (300ms), URL-synced (`?q=`),
  reusable for future list pages.
- **Pagination**: `Pagination.tsx` — URL-synced (`?page=`), 10 per page
  (`PRIZES_PAGE_SIZE`), reusable for future list pages.
- **Row actions** (`PrizeRowActions.tsx`): availability toggle, inline
  restock (amount input + confirm), edit link, delete with inline confirm.
  Delete surfaces a friendly error if the prize has recorded wins (blocked
  by the `on delete restrict` FK from `winner_records`) instead of a raw
  Postgres error.

---

## 7a. Winners Management Architecture *(Phase 6)*

Located at `/admin/winners`. Reuses every reusable pattern established by
Prize Management (Section 7) rather than inventing new ones.

- **Winner form**: split into two purpose-built forms rather than one
  form with conditionally-required fields —
  - `WinnerCreateForm.tsx` (`new/page.tsx`): manually records a win for an
    **existing** `game_sessions` row (picked from a dropdown of recent
    completed sessions) plus a prize (dropdown of active prizes); optional
    player name/contact override. `game_id` is derived server-side from the
    selected session, never trusted from client input.
  - `WinnerEditForm.tsx` (`[id]/page.tsx`): edits player name/contact and
    transitions `status`. Moving to `claimed`/`cancelled` auto-stamps the
    corresponding timestamp and, for `cancelled`, auto-restocks inventory —
    all via the existing DB triggers, so the action stays a plain update.
- **Validation**: `lib/validations/winner.ts` — `winnerCreateSchema`
  (`game_session_id`, `prize_id` as UUIDs, optional name/contact) and
  `winnerUpdateSchema` (name/contact + `status` enum), both Zod, mirrored
  server-side in the corresponding Server Action.
- **Search**: reuses `SearchInput.tsx` unmodified, matching on
  `player_name` OR `player_contact` (`ilike`, combined via `.or()`).
- **Filters**: `WinnerFilters.tsx` — status, game, prize (all `<Select>`
  dropdowns) and a won-date range (`from`/`to`), all URL-synced alongside
  search and pagination so the whole list state is shareable/bookmarkable.
- **CSV export**: `GET /admin/winners/export/csv` (Route Handler) re-runs
  the same filters with no pagination (capped at `WINNERS_EXPORT_LIMIT` =
  5000 rows) and streams back `text/csv` with a `Content-Disposition`
  attachment header. Uses the new generic `lib/csv.ts#toCsv()` helper.
- **Excel export**: `GET /admin/winners/export/xlsx` (Route Handler) — same
  filtered data, built into a workbook with the `xlsx` (SheetJS) package
  and returned as `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
- **Print**: a "Print" button calls `window.print()` directly on the list
  page (no separate print route). `AdminSidebar`, `AdminTopbar`, and all
  filter/pagination/action UI carry a `print:hidden` class (added to the
  existing shell components, not duplicated); the table gets a print-only
  report header (title + generation timestamp). This is the same page the
  admin is already viewing — printing always reflects the current filters.
- **Prize history** *(the "record timeline detail" option, decided
  interactively when scoping this phase)*: `WinnerTimeline.tsx` on the
  detail page (`[id]/page.tsx`) renders the win's status timeline (Won →
  Claimed/Cancelled/Expired, with timestamps) plus its linked prize
  (image, name, value) and linked game session (score, started/ended
  timestamps) — everything needed to understand one win's full history in
  one place.
- **New RLS policy required**: the original schema only let a *player*
  insert a `winner_records` row for their own completed session; admins
  had no insert path. Added
  `supabase/migrations/20260709040000_admin_insert_winner_records.sql`
  (an additional, independent `is_admin()`-gated INSERT policy) rather than
  altering the existing one.
- **Role**: identical posture to Prize Management — mutations require
  `admin`/`super_admin` (`requireRole` server-side, `RoleGate` in the UI);
  `moderator` gets read-only list + detail access.

---

## 7b. Game Management Architecture *(Phase 7)*

Located at `/admin/games`. Reuses the same reusable primitives as Prize/
Winners Management (`SearchInput`, `Pagination`, `RoleGate`) and introduces
one new shared primitive of its own (`ImageUpload`, below) rather than a
domain-specific duplicate.

- **Enable/disable**: `games.status` is a 4-state enum (`draft`/`active`/
  `paused`/`archived`), not a boolean, so the quick row-level `Switch`
  (`GameRowActions.tsx` → `toggleGameStatusAction`) only ever flips between
  `active` and `paused` — the common "pause/resume" operation — and is
  hidden entirely for `draft`/`archived` games, since publishing a draft or
  restoring an archived game is a deliberate lifecycle decision made in the
  full edit form (`GameForm.tsx`) instead of a quick toggle.
- **Edit timers**: two levels, both stored via existing columns rather than
  new ones. Per-question `time_limit_seconds` is edited directly in
  `QuestionForm.tsx`. A game-level *default* timer is stored inside the
  existing `games.config` jsonb column under `default_time_limit_seconds`
  — `GameForm.tsx` exposes it as its own numbered field (extracted from
  `config` on load, merged back in on save) rather than making the admin
  hand-edit raw JSON for something this common; anything else game-type-
  specific still goes in a separate "Additional config (JSON)" textarea.
  New questions prefill their timer from this game-level default.
- **Upload questions**: full CRUD via `QuestionForm.tsx` (`lib/actions/
  game-questions.ts`). Question type (`multiple_choice`/`true_false`/
  `text`) changes which fields render: multiple-choice gets a dynamic
  options list (React Hook Form `useFieldArray`, each option a generated
  id + text) and a correct-answer dropdown built from those options;
  true/false gets a True/False dropdown; text gets a plain expected-answer
  input. Reordering (`QuestionsList.tsx`) calls the `move_game_question`
  Postgres RPC (Section 4) rather than writing `order_index` directly from
  the client, so a concurrent reorder can't violate the table's unique
  `(game_id, order_index)` constraint. An optional `category` free-text
  field (Section 16c, `game_questions.category`) rounds out the form, with
  a `<datalist>` of `NAME_IT_TO_WIN_IT_CATEGORIES` suggestions -- it's only
  meaningful for `name_it_to_win_it` today but stays a generic tag rather
  than a type-specific column, in case another image-grouped type needs it
  later.
- **Upload images**: `ImageUpload.tsx` (`components/admin/ImageUpload.tsx`)
  is a **new generic component** extracted from Prize Management's image
  uploader — bucket name is now a prop. `PrizeImageUpload.tsx` was turned
  into a thin wrapper around it (bucket `"prize-images"`, zero behavior
  change, `PrizeForm.tsx` untouched) so the upload logic has exactly one
  implementation. Games use it two ways: game-level images (banner/
  thumbnail/background/icon, `GameImagesManager.tsx`, no `question_id`)
  and one optional image per question (inside `QuestionForm.tsx`, saved
  with `question_id` set and `image_type: 'question'`). Both write to the
  new `game-images` Storage bucket (public read, admin-only write — same
  RLS pattern as `prize-images`).
- **Bulk import / CSV import**: one cohesive feature
  (`CsvImportForm.tsx` + `lib/actions/game-questions.ts`), not two
  separate ones. Expected columns: `question_text, question_type, options`
  (pipe-separated, e.g. `Paris|London|Berlin`), `correct_answer`,
  `explanation`, `points`, `time_limit_seconds`, `category` (optional,
  added in Section 16c for `name_it_to_win_it`'s image groupings; blank for
  every other type). Every row is converted to the *exact same* candidate
  shape a manually-entered question would be (`csvRowToQuestionCandidate`)
  and validated with the *exact same* Zod schema (`gameQuestionSchema`)
  the manual form uses — no parallel validation logic. A "Download CSV
  template" button generates a sample file client-side from
  `QUESTIONS_CSV_TEMPLATE`.
- **Preview**: two distinct meanings, both implemented —
  1. *Within* the CSV import flow: `previewImportQuestionsAction` parses
     and validates without inserting anything; `CsvImportPreviewTable.tsx`
     shows every row's validity (and error message, if any) before the
     admin clicks "Import N questions" (`confirmImportQuestionsAction`,
     which re-validates defensively and inserts).
  2. The whole-game preview: `/admin/games/[id]/preview` →
     `GamePreview.tsx` renders the banner, description, and every question
     in order (with images, options, and the correct answer highlighted)
     so an admin can sanity-check content before flipping a game to
     Active. This is an admin review tool, distinct from the player-facing
     game engine (Section 16), which doesn't exist yet.
- **Delete safeguard**: `deleteGameAction` checks for existing
  `game_sessions`/`winner_records` referencing the game first; if any
  exist, it refuses (suggesting Archive instead) rather than silently
  cascading away play history, even though the schema's FKs would
  technically allow the cascade.
- **Role**: same posture as Prizes/Winners — mutations require `admin`/
  `super_admin`; `moderator` gets read-only list, question list, and
  preview access.

---

## 7c. Public Homepage Architecture *(Public Homepage phase)*

Located at `/` (`app/(site)/page.tsx`), a Server Component that fetches
public data (`lib/queries/public.ts`) and hands plain, serializable props
down to a tree of Client Components (`components/site/*`) that own the
actual interactivity.

- **Science theme**: `ScienceBackground.tsx` renders a reusable, absolutely-
  positioned field of slowly-drifting `lucide-react` icons (Atom, Dna,
  Orbit, FlaskConical, Sparkles) behind the hero, plus a soft blurred glow.
  Copy and category naming (Physics/Chemistry/Biology/Astronomy/Genetics/
  Robotics) reinforce the theme without introducing any new design tokens
  — colors are a small decorative hex palette (`WHEEL_COLORS`) separate
  from the `globals.css` CSS-variable system, since wheel wedges need more
  hues than the admin UI's primary/secondary/muted set provides.
- **Animations**: Framer Motion throughout, consistent with the project's
  existing 0.15-0.3s easeOut conventions for entrances, plus `whileInView`
  (once-only) staggered reveals for `HowItWorks.tsx` and `RecentWinners.tsx`
  so content animates in as the visitor scrolls rather than all at once.
- **Two wheels, one shared state**: `WheelArena.tsx` is the only place that
  holds cross-wheel state — a single `unlocked` boolean, flipped once by
  `GameWheel`'s `onAdvance` callback. Both wheels are otherwise fully
  self-contained (their own rotation/spinning/result state).
  - **`Wheel.tsx`** — generic, reusable SVG wheel primitive shared by both
    (no duplicated wedge-drawing or rotation logic). Takes `segments`
    (`WheelSegment[]`, see `types/index.ts`), a parent-owned `rotation`
    number, and renders wedges via SVG arc paths + rotated labels. Spin
    math (`mod360`, `computeSpinRotation`) lives in `lib/wheel.ts`, imported
    by both `GameWheel` and `PrizeWheel` rather than duplicated per-wheel.
  - **Game Wheel** — fixed six-wedge set (`GAME_WHEEL_SEGMENTS`,
    `constants/home.ts`), three tagged `outcome: "advance"`, three
    `outcome: "retry"`. Landing wedge is chosen with a single uniform
    random index, and the outcome is read directly off that wedge — no
    hidden RNG contradicting what's visually landed on.
  - **Prize Wheel (locked until success)** — rendered dimmed/grayscale with
    a `Lock` icon overlay (`AnimatePresence` fade) until `unlocked` is
    `true`; spin button is disabled the whole time. Segments come from
    `getActivePrizesForWheel()` (real `is_active = true` prizes, weighted by
    `probability_weight`) when 3+ exist, otherwise `PRIZE_WHEEL_FALLBACK`
    (real, deployable copy for a not-yet-stocked catalog — not a "coming
    soon" placeholder). Landing is a weighted-random pick
    (`pickWeightedIndex`), and the result is explicitly labeled preview-only
    since no `game_session`/`winner_records` row is written here — that
    remains the job of the not-yet-built player game engine (Section 16).
- **Recent Winners feed**: `RecentWinners.tsx` renders `getRecentWinnersFeed()`
  results (the `recent_winners_feed` view, player names pre-masked by the
  view itself) — the first thing in the app to surface that view outside
  the database layer.
- **Responsive**: mobile-first; the two wheels stack vertically on small
  screens and sit side-by-side (with a connecting arrow) at `lg:` and up,
  matching the project's existing Tailwind breakpoint conventions.
- **Nav updated, not rebuilt**: `constants/site.ts`'s `SITE_CONFIG.navItems`
  gained two in-page anchor links (`Play` -> `/#play`, `Winners` ->
  `/#winners`); `Navbar.tsx`/`MobileMenu.tsx` were not touched.

---

## 8. Routing Structure

```
/                        Public home — DONE (Hero, Game/Prize wheels, How It Works, Recent Winners)
/#play                   Anchor: Wheel Arena section
/#how-it-works           Anchor: How It Works section
/#winners                Anchor: Recent Winners section
/login                   Admin sign-in (no site chrome)
/play                    Unified Game Engine -- random active quiz/spin_wheel game (Section 16b)

/admin                   Dashboard                         [requireAdmin]
/admin/games              Game list (search+status filter+pagination) [requireAdmin]
/admin/games/new            Create game                       [requireRole: admin, super_admin]
/admin/games/[id]             Edit game + game-level images     [requireAdmin] (edit form itself is RoleGated)
/admin/games/[id]/preview      Read-only full game preview       [requireAdmin]
/admin/games/[id]/questions      Question list + reorder          [requireAdmin]
/admin/games/[id]/questions/new   Add one question                 [requireRole: admin, super_admin]
/admin/games/[id]/questions/[qid] Edit one question                [requireRole: admin, super_admin]
/admin/games/[id]/questions/import Bulk CSV import (preview+confirm)[requireRole: admin, super_admin]
/admin/prizes              Prize list (search + pagination)  [requireAdmin]
/admin/prizes/new           Create prize                      [requireRole: admin, super_admin]
/admin/prizes/[id]           Edit prize                        [requireRole: admin, super_admin]
/admin/winners             Winner list (search+filters+export+print) [requireAdmin]
/admin/winners/new          Record a win manually             [requireRole: admin, super_admin]
/admin/winners/[id]          Detail: edit + Prize History       [requireAdmin] (edit form itself is RoleGated)
/admin/winners/export/csv    CSV download (Route Handler)       [requireAdmin]
/admin/winners/export/xlsx   Excel download (Route Handler)     [requireAdmin]
/admin/sessions            Placeholder                       [requireAdmin]
/admin/analytics           Placeholder                       [requireAdmin]
/admin/activity-logs       Placeholder                       [requireAdmin]
/admin/settings            Placeholder                       [requireAdmin]
/admin/admins              Placeholder                       [requireRole: super_admin]
```

Route groups `(site)`, `(auth)`, and `(play)` organize layouts without
affecting the URL. `/admin/*` is a real segment (not a group) so
middleware can match on the `/admin` prefix directly.

---

## 9. API Endpoints and Their Purposes

This app has **no traditional `/api` REST routes**. Two mechanisms serve
that role instead:

**A. Next.js Server Actions** (the app's real "API layer" — colocated,
typed end-to-end, no fetch/serialization boilerplate):

| Action | File | Purpose | Auth |
| --- | --- | --- | --- |
| `loginAction` | `lib/auth/actions.ts` | Authenticate an admin, verify role, stamp last login, redirect | Public |
| `logoutAction` | `lib/auth/actions.ts` | Sign out, redirect to `/login` | Any signed-in user |
| `createPrizeAction` | `lib/actions/prizes.ts` | Insert a prize + its inventory row | admin, super_admin |
| `updatePrizeAction` | `lib/actions/prizes.ts` | Update prize catalog fields + low-stock threshold | admin, super_admin |
| `deletePrizeAction` | `lib/actions/prizes.ts` | Delete a prize (blocked if it has wins) | admin, super_admin |
| `toggleAvailabilityAction` | `lib/actions/prizes.ts` | Flip `prizes.is_active` | admin, super_admin |
| `restockPrizeAction` | `lib/actions/prizes.ts` | Add units to `prize_inventory.quantity_total` | admin, super_admin |
| `createWinnerAction` | `lib/actions/winners.ts` | Manually record a win for an existing completed session | admin, super_admin |
| `updateWinnerAction` | `lib/actions/winners.ts` | Update contact info + status (triggers handle timestamps/restock) | admin, super_admin |
| `markClaimedAction` | `lib/actions/winners.ts` | Convenience wrapper: set status to `claimed` | admin, super_admin |
| `markExpiredAction` | `lib/actions/winners.ts` | Convenience wrapper: set status to `expired` | admin, super_admin |
| `cancelWinAction` | `lib/actions/winners.ts` | Convenience wrapper: set status to `cancelled` (auto-restocks) | admin, super_admin |
| `deleteWinnerAction` | `lib/actions/winners.ts` | Delete a winner record (auto-restocks via the same trigger) | admin, super_admin |
| `createGameAction` | `lib/actions/games.ts` | Create a game (auto slug from name, uniqueness-checked) | admin, super_admin |
| `updateGameAction` | `lib/actions/games.ts` | Update game metadata, default timer, and advanced config | admin, super_admin |
| `toggleGameStatusAction` | `lib/actions/games.ts` | Quick enable/disable: flips `status` between `active`/`paused` | admin, super_admin |
| `deleteGameAction` | `lib/actions/games.ts` | Delete a game (blocked if it has sessions/wins — suggests Archive) | admin, super_admin |
| `createQuestionAction` | `lib/actions/game-questions.ts` | Add a question (auto `order_index`, optional image) | admin, super_admin |
| `updateQuestionAction` | `lib/actions/game-questions.ts` | Update a question's fields + synced image | admin, super_admin |
| `deleteQuestionAction` | `lib/actions/game-questions.ts` | Delete a question (its image row cascades automatically) | admin, super_admin |
| `moveQuestionAction` | `lib/actions/game-questions.ts` | Reorder via the `move_game_question` RPC (atomic swap) | admin, super_admin |
| `previewImportQuestionsAction` | `lib/actions/game-questions.ts` | Parse + validate a CSV without inserting anything | admin, super_admin |
| `confirmImportQuestionsAction` | `lib/actions/game-questions.ts` | Re-validate + bulk-insert the previewed rows | admin, super_admin |
| `addGameImageAction` | `lib/actions/game-images.ts` | Attach a game-level image (banner/thumbnail/background/icon) | admin, super_admin |
| `deleteGameImageAction` | `lib/actions/game-images.ts` | Remove a game-level image | admin, super_admin |
| `startGameSessionAction` | `lib/actions/game-sessions.ts` | Anonymous sign-in (if needed) + attempt-cap check + create a real `game_sessions` row, for any game type | **Public** (any visitor -- these five are the only non-admin-gated actions in the app) |
| `spinForPrizeAction` | `lib/actions/game-sessions.ts` | Mark session completed (if needed), weighted-draw an available prize, insert `winner_records` (stock-race-safe retry) -- shared by every game type's Prize Wheel stage | **Public** (session-scoped to the caller's own `auth.uid()`) |
| `claimPrizeAction` | `lib/actions/game-sessions.ts` | Claim a won prize via the `claim_prize_win` RPC -- name/contact only, ownership + pending-status enforced server-side | **Public** (session-scoped) |
| `getRandomQuestionAction` | `lib/actions/quiz.ts` | Client-callable wrapper around `getRandomQuestionForGame()` -- lets "Try Again" fetch a fresh question without a page reload | **Public** |
| `submitQuizAnswerAction` | `lib/actions/quiz.ts` | Checks an answer via the `check_quiz_answer` RPC; marks the session completed only on an incorrect answer | **Public** (session-scoped) |

**B. Supabase auto-generated PostgREST API**, called via the typed
`supabase-js` client (never raw `fetch`) from:

- `lib/queries/*.ts` (server-only reads: `getDashboardStats`,
  `getRecentWinners`, `getRecentActivity`, `listPrizes`, `getPrizeById`,
  `listWinnerRecords`, `listWinnerRecordsForExport`, `getWinnerDetail`,
  `getGameOptions`, `getActivePrizeOptions`, `getRecentCompletedSessions`,
  `listGames`, `getGameById`, `getGameBySlugExists`, `listGameQuestions`,
  `getGameQuestionById`, `getNextQuestionOrderIndex`, `listGameLevelImages`,
  `listGameQuestionsForPreview`, `getActivePrizesForWheel`, `getRecentWinnersFeed`,
  `getRandomActiveGame`, `getAvailablePrizesForWheel`, `getRandomQuestionForGame`
  -- the last five are anonymous-safe reads used by the public homepage
  and the real `/play` Game Engine, never assuming an admin session)
- `lib/supabase/middleware.ts` (session + admin-status check)
- `lib/auth/session.ts` (`getCurrentAdmin`)
- Four Postgres RPCs exposed through this same client:
  `supabase.rpc('record_admin_login')`,
  `supabase.rpc('move_game_question', { p_question_id, p_direction })`,
  `supabase.rpc('check_quiz_answer', { p_question_id, p_submitted_answer })`
  (Section 16b), and
  `supabase.rpc('claim_prize_win', { p_winner_record_id, p_player_name, p_player_contact })`
  (Section 16b).

**C. Route Handlers** *(the documented exception, first used in Phase 6)*:
file downloads need custom response headers (`Content-Type`,
`Content-Disposition`) and a raw body (CSV text / an XLSX binary buffer),
which Server Actions aren't suited to returning to a browser-triggered
download. Both call the same `lib/queries/winners.ts#listWinnerRecordsForExport`
used nowhere else, so filters always match what's on screen:

| Route | File | Purpose | Auth |
| --- | --- | --- | --- |
| `GET /admin/winners/export/csv` | `app/admin/winners/export/csv/route.ts` | Streams the filtered winner list as `text/csv` | admin+ (`requireAdmin`) |
| `GET /admin/winners/export/xlsx` | `app/admin/winners/export/xlsx/route.ts` | Streams the filtered winner list as a `.xlsx` workbook (via the `xlsx`/SheetJS package) | admin+ (`requireAdmin`) |

**Convention going forward**: new mutations are Server Actions in
`src/lib/actions/<domain>.ts`; new reads are functions in
`src/lib/queries/<domain>.ts`. Only introduce a real Route Handler
(`app/.../route.ts`) for the same class of exception as above — a file
download, a webhook, a non-browser client, or a streaming response — not
for normal CRUD.

---

## 10. Reusable Components and Their Responsibilities

| Component | Responsibility |
| --- | --- |
| `ui/Button.tsx` | Variant (`primary/secondary/outline/ghost`) + size button |
| `ui/Input.tsx` | Styled text input, forwardRef |
| `ui/Textarea.tsx` | Styled multiline input |
| `ui/Select.tsx` | Styled native `<select>` with chevron icon |
| `ui/Switch.tsx` | Boolean toggle control |
| `ui/Label.tsx` | Form label |
| `ui/Logo.tsx` | Site/brand mark, links home |
| `layout/MainLayout.tsx` | Navbar + main + Footer wrapper (public site) |
| `layout/Navbar.tsx` / `MobileMenu.tsx` | Public site navigation, responsive |
| `layout/Container.tsx` | Max-width content wrapper |
| `providers/SupabaseProvider.tsx` | Browser Supabase client + live session in context |
| `providers/AdminProvider.tsx` | Signed-in `AdminProfile` in context, scoped to `/admin` |
| `auth/LoginForm.tsx` | Login form UI + submission |
| `admin/AdminShell.tsx` | Responsive admin layout composition |
| `admin/AdminSidebar.tsx` | Nav links, active state, role filtering, mobile drawer |
| `admin/AdminTopbar.tsx` | Mobile menu trigger, admin identity, logout |
| `admin/RoleGate.tsx` | Renders children only if the admin's role is in an allow-list |
| `admin/StatCard.tsx` | Labeled metric card with icon + tone (default/warning/success) |
| `admin/SearchInput.tsx` | Debounced, URL-synced search box — **reuse for any future list page** |
| `admin/Pagination.tsx` | URL-synced prev/next pager — **reuse for any future list page** |
| `admin/prizes/PrizeForm.tsx` | Create/edit form for a prize (metadata + image + starting stock) |
| `admin/prizes/PrizeImageUpload.tsx` | Thin wrapper around `admin/ImageUpload.tsx` pinned to `prize-images` (kept for import compatibility) |
| `admin/ImageUpload.tsx` | Generic, bucket-parameterized Storage uploader — **the real upload logic, reused by prizes and games** |
| `admin/prizes/PrizeTable.tsx` | Prize list table |
| `admin/prizes/PrizeRowActions.tsx` | Per-row availability/restock/edit/delete controls |
| `admin/winners/WinnerFilters.tsx` | Status/game/prize/date-range filter bar, URL-synced |
| `admin/winners/WinnersTable.tsx` | Winner list table |
| `admin/winners/WinnerRowActions.tsx` | Per-row view/mark-claimed/cancel/delete controls |
| `admin/winners/WinnerCreateForm.tsx` | "Record Win" form (existing session + prize picker) |
| `admin/winners/WinnerEditForm.tsx` | Edit contact info + status transition |
| `admin/winners/WinnerTimeline.tsx` | "Prize History" — status timeline + linked prize/session context |
| `admin/winners/ExportButtons.tsx` | CSV/Excel export links + Print trigger, filter-aware |
| `lib/csv.ts#toCsv()` | Generic row/column-accessor → CSV string builder — **reuse for any future export** |
| `lib/csv.ts#parseCsv()` / `#csvRowsToObjects()` | Quoted-field-aware CSV parser + header-mapping — **reuse for any future import** |
| `admin/games/GameForm.tsx` | Create/edit form for a game (metadata, default timer, advanced JSON config, thumbnail) |
| `admin/games/GamesTable.tsx` | Game list table |
| `admin/games/GameRowActions.tsx` | Enable/disable switch, preview/questions/edit links, delete confirm |
| `admin/games/GameStatusFilter.tsx` | Status dropdown filter, URL-synced |
| `admin/games/GameImagesManager.tsx` | Game-level image grid (banner/thumbnail/background/icon) + uploader |
| `admin/games/QuestionsList.tsx` | Ordered question list with up/down reorder |
| `admin/games/QuestionForm.tsx` | Question editor: type-conditional fields, dynamic options, timer, optional image, optional `category` (Section 16c, datalist-suggested) |
| `admin/games/CsvImportForm.tsx` | Upload → preview → confirm bulk-import flow, template download |
| `admin/games/CsvImportPreviewTable.tsx` | Per-row validity display before committing an import |
| `admin/games/GamePreview.tsx` | Read-only render of a game + all questions, correct answers highlighted |
| `site/SectionHeading.tsx` | Plain eyebrow/title/subtitle header -- reusable across any homepage section |
| `site/ScienceBackground.tsx` | Reusable ambient floating-icon backdrop (any section can drop it in) |
| `ui/Wheel.tsx` | Generic reusable SVG spinning-wheel primitive (moved from site/ in Section 16a) -- **the real wedge/rotation logic, shared by GameWheel, PrizeWheel, and 16b's PrizeStage** |
| `site/GameWheel.tsx` | Spin-to-advance wheel: fixed science-category wedges, uniform-random landing determines outcome |
| `site/PrizeWheel.tsx` | Locked-until-success wheel: live prize catalog (or fallback), weighted-random landing |
| `site/WheelArena.tsx` | Owns the one shared `unlocked` boolean connecting the two wheels; responsive side-by-side/stacked layout |
| `site/HowItWorks.tsx` | 4-step explainer, staggered scroll-in animation |
| `site/RecentWinners.tsx` | Public recent-winners feed, fed by the `recent_winners_feed` view |
| `lib/wheel.ts#computeSpinRotation()` / `#scheduleSpinTicks()` | Shared spin-rotation math + tick-sound scheduling -- **reuse for any future wheel/spinner** |
| `play/GameEngine.tsx` | **THE reusable Game Engine** -- stage state machine every playable game runs through; `QUESTION_BASED_TYPES` set covers all 24 non-wheel implemented types (`quiz`, `decoder`, `guess_the_gibberish`, `name_it_to_win_it`, `logo_challenge`, `chemical_symbol_challenge`, `true_or_false`, `guess_the_unit`, `measurement_challenge`, `equipment_match`, `which_laboratory`, `hazard_symbol`, `odd_one_out`, `word_scramble`, `emoji_science`, `picture_puzzle`, `memory_challenge`, `spot_the_difference`, `ppe_challenge`, `calibration_challenge`, `science_bingo`, `science_facts`, `mini_crossword`, `wheel_of_science_facts` -- Section 16b/16c/16d/16e/16f/16g) |
| `play/GameIntro.tsx` | Title + Mechanics + Start button stage |
| `play/QuizChallenge.tsx` | Random question + countdown timer/sound + answer input stage -- renders `multiple_choice`/`true_false`/`text` question types and `image_url`/`category` when set (Section 16c/16d/16e/16f), shared by all 24 question-based game types |
| `play/CountdownTimer.tsx` | Generic countdown bar -- **reuse for any future timed stage** |
| `play/AnswerReveal.tsx` | Reveal answer + You Got It!/"Try Again Next Time" + stage Navigation |
| `play/PrizeStage.tsx` | Prize Wheel stage: wraps `ui/Wheel.tsx` + `spinForPrizeAction`, own thin spin orchestration |
| `play/ClaimForm.tsx` | Claim flow: RHF+Zod form, calls `claimPrizeAction` |
| `play/ThankYouScreen.tsx` | Final confirmation + Play Again |
| `play/SoundToggle.tsx` | Mute/unmute button, reads `useSound()` |
| `providers/SoundProvider.tsx` / `hooks/useSound.ts` | Mute flag (localStorage) + sound-effect dispatch -- **reuse for any future player-facing game type** |
| `lib/sound.ts` | Synthesized Web Audio API sound effects, no audio files -- **reuse for any future game type's sound cues** |
| `lib/quiz.ts#parseQuizOptions()` / `#describeQuizAnswer()` | Shared quiz-options parsing + answer display -- **reuse for any future question-based game type** |
| `admin/analytics/ChartCard.tsx` | Chart container matching the Dashboard's panel style -- **reuse for any future chart** (Section 19) |
| `admin/analytics/DailyParticipationChart.tsx` | Two-series (sessions/winners) area chart over a trailing-N-day window |
| `admin/analytics/AnswerAccuracyChart.tsx` | Correct vs incorrect donut chart |
| `admin/analytics/PopularGamesChart.tsx` | Horizontal ranked bar chart, top games by sessions played |
| `admin/analytics/InventoryReportTable.tsx` | Read-only, full per-prize stock report (distinct from `PrizeTable`'s CRUD list) |
| `lib/queries/analytics.ts` | Six typed wrapper functions around the Analytics RPCs -- **reuse for any future analytics card/chart** (Section 19) |

When building Sessions/Settings/Activity Logs admin UIs, reuse
`SearchInput`, `Pagination`, `RoleGate`, `StatCard`, `admin/ImageUpload.tsx`,
`lib/csv.ts` (both directions), and the `ui/*` primitives rather than
writing new versions. The Winners module's filter-bar-plus-export-buttons
layout (`WinnerFilters` + `ExportButtons` side by side above the table) is
also the intended template for any future exportable list, and the Games
module's upload-preview-confirm flow (`CsvImportForm` +
`CsvImportPreviewTable`) is the intended template for any future bulk
import.

---

## 11. State Management Approach

No global client state library (Redux/Zustand/React Query) is installed —
deliberately. The app leans on the Next.js App Router model instead:

- **Server state lives on the server.** Server Components fetch directly
  from Supabase per request (`lib/queries/*.ts`); there is no client-side
  cache to keep in sync. Mutations (Server Actions) call
  `revalidatePath()` and/or the client calls `router.refresh()` to get
  fresh server-rendered data.
- **URL is the source of truth for list state.** Search (`?q=`) and
  pagination (`?page=`) live in the URL via `useSearchParams`/`router.push`
  (`SearchInput`, `Pagination`), not component state — shareable/bookmarkable
  and automatically correct on refresh.
- **React Context for cross-cutting concerns only**, each with a single
  responsibility:
  - `SupabaseContext` (`SupabaseProvider`) — the browser Supabase client
    instance + live `session`.
  - `AdminContext` (`AdminProvider`) — the signed-in admin's profile,
    scoped to the `/admin` subtree.
- **Local component state** (`useState`/`useTransition`) for everything
  ephemeral and non-shared: form pending states, inline restock/delete
  confirmation, image upload progress, sidebar open/closed.
- **Forms**: React Hook Form owns form state; Zod validates; submission
  goes through a Server Action via `useTransition`, with the result
  (`{ error? }`) fed back into local state for display.

If a future phase needs cross-page client caching (e.g. a live game board
with sockets/polling), introduce a dedicated library then — don't retrofit
one globally.

---

## 12. Environment Variables Required

Defined in `.env.local.example`; copy to `.env.local` for local dev.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL; used by both browser and server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key; RLS-restricted, safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Only for admin bootstrap / future scheduled jobs | Bypasses RLS entirely — server-side only, never imported into client code |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL used in `SITE_CONFIG` / metadata |

No other environment variables exist yet. When the rest of the game engine
or an analytics cron job is added (Sections 16/19), expect additions such as
a cron secret or storage bucket name overrides — document them here when
introduced.

**Non-env deployment prerequisite (Section 16a)**: the Spin Wheel engine's
`startSpinWheelSessionAction` calls `supabase.auth.signInAnonymously()`,
which requires **Anonymous Sign-Ins** to be enabled in the Supabase
dashboard under Authentication → Settings. This is a project setting, not
an environment variable, so it can't be captured in `.env.local.example` —
without it, `/play` fails closed with a friendly error rather than
crashing, but no one will actually be able to play until it's turned on.

---

## 13. Coding Conventions and Naming Standards

- **Files**: PascalCase for components (`PrizeForm.tsx`), camelCase for
  hooks/utils (`useAdmin.ts`, `roles.ts`), kebab-case for route segments
  and multi-word constant files (`activity-logs/`, `admin-nav.ts`).
- **Directives**: `"use client"` only on files that need interactivity/
  hooks/browser APIs; everything else defaults to Server Components.
  `"use server"` at the top of files under `lib/auth/actions.ts` and
  `lib/actions/*.ts` only.
- **`server-only` guard**: any module that must never end up in a client
  bundle (`lib/auth/session.ts`, `lib/queries/*.ts`) starts with
  `import "server-only";`.
- **Barrel exports**: every `constants/`, `hooks/`, and `lib/validations/`
  subfolder has an `index.ts` re-exporting its siblings; import from the
  barrel (`@/constants`, `@/hooks`) rather than deep paths, except where a
  file is intentionally domain-scoped (e.g. `@/lib/queries/prizes`).
- **Validation pattern**: one Zod schema per form, colocated in
  `lib/validations/<domain>.ts`, with an inferred type exported alongside
  it — `export const prizeSchema = z.object(...)` +
  `export type PrizeFormValues = z.infer<typeof prizeSchema>`.
- **Server Action naming**: `verbNounAction` (`createPrizeAction`,
  `toggleAvailabilityAction`), returning `Promise<{ error?: string }>` (or
  `void` when it always redirects on success). Never throw for expected
  failure paths; return `{ error }` instead. Let `redirect()` propagate
  unmodified — never wrap it in try/catch.
- **Query naming**: `getX` for a single record, `listX` for a paginated/
  filtered collection, colocated in `lib/queries/<domain>.ts`.
- **Component props**: `interface XProps { ... }` declared directly above
  the component.
- **Styling**: Tailwind utility classes + the `cn()` helper for conditional
  classes; no inline `style=` unless a value is truly dynamic/computed. Use
  the design tokens (`bg-primary`, `text-muted-foreground`, `border-border`,
  etc.) instead of raw colors, except for semantic status colors
  (amber/emerald/red) that intentionally sit outside the token system.
- **Icons**: `lucide-react` exclusively.
- **Security posture**: application-level checks (`requireAdmin`,
  `requireRole`, middleware) are UX conveniences; every table's RLS
  policy is the actual gate. Never write a feature that "relies" on the
  app layer being correct instead of the DB layer.

---

## 14. UI/UX Design Guidelines

- **Design tokens** live as HSL CSS variables in `src/app/globals.css`
  (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`,
  `--border`, `--radius`), mapped into Tailwind's theme in
  `tailwind.config.ts`. A `.dark` variant is already defined in CSS but
  there is no dark-mode toggle UI yet — token infrastructure is ready
  whenever that's wanted.
- **Typography**: Inter, loaded via `next/font/google` in the root layout,
  applied through a CSS variable + `font-sans`.
- **Shape/elevation**: rounded corners (`rounded-md`/`rounded-lg` off
  `--radius`), thin `border-border` borders, no heavy shadows — flat,
  content-forward admin aesthetic.
- **Status color conventions** (used consistently across dashboard and
  prize management, reuse for future modules):
  - Emerald (`bg-emerald-100 text-emerald-700`) — success / available /
    good standing.
  - Amber (`bg-amber-100 text-amber-700`) — warning / low stock /
    needs attention.
  - Red (`text-red-600` / `bg-red-50 border-red-200`) — destructive /
    error / out of stock.
  - Primary tint (`bg-primary/10 text-primary`) — neutral/informational
    emphasis (default `StatCard` tone, active nav link).
- **Responsive rules**: mobile-first; card grids go
  `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4`; the admin sidebar is a
  Framer-Motion off-canvas drawer below `md`, a persistent fixed column
  at `md` and above; tables scroll horizontally on narrow viewports
  (`overflow-x-auto` + `min-w-[...]`) rather than collapsing to cards.
- **Feedback patterns**: inline red alert banners (`role="alert"`) for
  form-level errors under the header of the form; inline confirm
  (button label flips to "Confirm"/"Cancel") for destructive row actions
  instead of native `window.confirm` or a modal library.
- **Icon sizing**: 16–20px (`h-4 w-4` / `h-5 w-5`), always paired with a
  visible text label in admin UI (icon-only buttons get `aria-label`).

---

## 15. Animations and Sound Effects Architecture

**Animations — implemented, Framer Motion throughout:**

| Where | Effect |
| --- | --- |
| `layout/MobileMenu.tsx` | Height/opacity expand-collapse for public-site mobile nav |
| `admin/AdminSidebar.tsx` | Off-canvas drawer slide (`x: "-100%" → 0`) + backdrop fade, mobile only |
| `auth/LoginForm.tsx` | Entrance fade + slide-up on mount |
| `admin/StatCard.tsx` | Staggered fade + slide-up entrance (`delay: index * 0.04`) |

Convention: 0.15–0.25s durations, `easeOut` for entrances, `easeInOut` for
expand/collapse, `AnimatePresence` for any mount/unmount transition. Keep
new animations in this same range — this is a business admin tool, not a
showcase; motion should read as "polished," not "flashy."

**Sound effects — not implemented yet.** Planned for the player-facing game
engine (Section 16), where audio feedback actually matters (correct
answer, spin, win). Planned shape:

- `src/lib/sound.ts` — a small wrapper around the Web Audio API /
  `<audio>` elements: `playSound(name: SoundName)`, preloading a fixed set
  of short clips (correct, incorrect, win, spin-tick, drumroll).
- `src/components/providers/SoundProvider.tsx` — client context holding a
  mute flag and volume, persisted to `localStorage` (this is a real
  browser app, not a Claude-rendered artifact, so `localStorage` is the
  right tool here) and exposing `useSound()`.
- Every game-engine interaction that currently has a Framer Motion visual
  cue gets a paired sound cue behind this same provider, so muting is a
  single global switch.
- No sound is planned anywhere in the admin panel — audio feedback is a
  player-experience concern only.

---

## 16. Planned Game Engine Architecture *(superseded by 16b for quiz/spin_wheel)*

**Historical note**: this section originally sketched a per-type
`GameEngine` interface (`start`/`submitAction`/`isComplete`/`computeScore`)
with a separate class per `game_type` in `src/lib/game-engine/<type>.ts`.
What actually got built (Section 16b) took a simpler, more pragmatic shape
once real requirements (a countdown timer, a claim form, a shared Prize
Wheel reward) were in front of us: one concrete `GameEngine.tsx` React
component holding a stage state machine, backed by plain Server Actions
(`lib/actions/game-sessions.ts`, `lib/actions/quiz.ts`) rather than an
abstract per-type class hierarchy. The interface below is kept for
historical context and because it's still a reasonable shape for
`claw_machine`/`scratch_card`/`slot_machine` if/when those are built --
but treat Section 16b as what's actually true today, not this.

Two of five `game_type`s are implemented (`quiz`, `spin_wheel` -- Section
16b); `claw_machine`/`scratch_card`/`slot_machine` remain unbuilt, with
`GameEngine.tsx` showing an honest "not built yet" state for them rather
than a fake mechanic. Content authoring for all five types has been fully
admin-manageable since Phase 7 (Section 7b) — games, timers, questions
(including bulk CSV import), and images. Note also that
`/admin/games/[id]/preview` (Section 7b) is an **admin** content-review
tool, unrelated to the player engine below.

The public homepage's Game Wheel / Prize Wheel (Section 7c) remains a
related but separate thing: a front-end-only marketing preview with its
own local win/lose logic, not a version of this engine. It deliberately
never creates a `game_session` or `winner_records` row, and its win screen
still says so ("Preview only") -- the homepage was intentionally left
untouched when both 16a and 16b were built, per the "do not rebuild
previous work" rule.

Original (superseded) design sketch, kept for the remaining three types:

- **Engine abstraction**: one `GameEngine` contract per `game_type`:

  ```ts
  interface GameEngine {
    start(session: GameSessionContext): EngineState;
    submitAction(state: EngineState, action: PlayerAction): EngineState;
    isComplete(state: EngineState): boolean;
    computeScore(state: EngineState): number;
  }
  ```

  Implementations: `ClawMachineEngine`, `ScratchCardEngine`,
  `SlotMachineEngine`, each in `src/lib/game-engine/<type>.ts` -- `quiz`
  and `spin_wheel` do **not** use this shape; see 16b.
- **Rendering**: a per-type renderer registered the same way
  `GameEngine.tsx` currently switches on `game.game_type` internally
  (Section 16b) -- extend that switch, don't build a parallel
  `GameContainer.tsx`.

---

## 16a. Spin Wheel — Real Player Engine *(Superseded by 16b; kept working)*

**Historical/status note**: this section documents what was originally
built as a standalone experience at `/play`. `/play` now renders the
unified `GameEngine` (Section 16b) for every playable game, spin_wheel
included, so the component this section describes
(`components/play/SpinWheelGame.tsx`) is no longer reachable from any
route -- left in place only because this workspace can't delete
already-written files (see its own superseded-notice doc comment). The
underlying mechanics and Server Actions described below **did not go
away** -- they were generalized in place and are exactly what 16b's Prize
Wheel stage reuses: `getRandomActiveSpinWheelGame()` became
`getRandomActiveGame(gameTypes)` (defaults to `["quiz", "spin_wheel"]`),
and `startSpinWheelSessionAction(gameId)` became
`startGameSessionAction(gameId, gameType)`. Read this section for the
*mechanics* (still entirely accurate); read 16b for where they're now
actually invoked from.

- **Random game selection**: `getRandomActiveGame()` (`lib/queries/
  play.ts`) fetches every candidate game with `status = 'active'` and, if
  set, within its `start_date`/`end_date` window (the exact case
  DATABASE.md's `games (status, start_date, end_date)` composite index
  was built for, unused until this feature), then picks one at random in
  application code — PostgREST has no `order by random()`, and the
  candidate set is expected to be small.
- **Prevent unavailable prizes**: prizes are never read from
  `prize_inventory` directly (admin-only RLS, Section 4) — a view,
  `available_prizes_for_wheel` (migration
  `20260710010000_available_prizes_view.sql`), joins `prizes` +
  `prize_inventory` and exposes only `is_active = true and
  quantity_available > 0` rows, with raw stock counts excluded (so exact
  inventory numbers stay admin-only, only "spinnable or not" is public).
  Both the wheel's displayed segments *and* the server-side draw pool come
  from this same view/query (`getAvailablePrizesForWheel()`) — no separate
  "public" list that could drift from what's actually in stock.
- **Random prize selection**: weighted by the prize's own
  `probability_weight` (`pickWeightedIndex` in
  `lib/actions/game-sessions.ts`), computed fresh, server-side, at spin
  time — never trusted from the client.
- **Real session + real win, safely**:
  1. `startGameSessionAction(gameId, gameType)` re-validates the game's
     `status`/`game_type` from the database against the *caller's*
     expected `gameType` (never trusts a client-passed copy of the game's
     own data), signs the visitor in via Supabase **anonymous auth**
     (`supabase.auth.signInAnonymously()`) if they don't already have a
     session — required because every `game_sessions`/`winner_records` RLS
     policy is keyed off `auth.uid()` — enforces `max_attempts_per_user`
     by counting the player's existing sessions for that game, then
     inserts a real `game_sessions` row.
  2. `spinForPrizeAction(sessionId)` re-verifies session ownership +
     `status = 'in_progress'`, marks it `completed` *if still in
     progress* (16b's Quiz challenge marks a losing session completed
     itself, so this is a safe no-op in that case), draws a weighted
     prize from the *current* available pool, and inserts a real
     `winner_records` row (now also returning the new row's own id, so
     16b's Claim flow has something to reference). The existing
     `handle_prize_win()` trigger (Section 4) is the final, atomic
     authority: if the picked prize sold out in the split second between
     the read above and this insert (a real race under concurrent
     players), the trigger raises and the action drops that prize and
     retries with the remaining pool (up to 3 attempts) rather than
     failing the whole spin over one sold-out prize.
  3. The animation only starts once step 2 returns — the wheel always
     lands exactly on the prize that was actually won; there is no
     "animate first, hope the server agrees" step.
- **Smooth animation, reused, not rebuilt**: `components/ui/Wheel.tsx` is
  the exact same primitive the homepage's `GameWheel`/`PrizeWheel` *and*
  16b's `PrizeStage.tsx` all use — three thin wrappers around one
  implementation.
- **Sound effects**: synthesized at runtime with the Web Audio API
  (`lib/sound.ts` — oscillators + gain envelopes, no audio files, nothing
  to license), not the file-path-based design originally sketched in
  Section 15. `SoundProvider`/`useSound()` (mute flag, `localStorage`-
  persisted) is mounted only in `(play)/layout.tsx`, matching Section 15's
  "no sound in the admin panel" rule. A tick sound fires once per
  wheel-segment boundary crossed during the spin
  (`scheduleSpinTicks()` in `lib/wheel.ts`, timed against an ease-out
  curve — a decorative approximation, not a frame-perfect physics match).
- **`Wheel.tsx` relocated, not duplicated**: now genuinely cross-domain (
  site/, play/), so it moved from `components/site/Wheel.tsx` to
  `components/ui/Wheel.tsx`. The old path couldn't be deleted (workspace
  restriction on removing already-written files), so it's now a one-line
  re-export shim — the same pattern already established by
  `PrizeImageUpload.tsx` — meaning `GameWheel.tsx`/`PrizeWheel.tsx` needed
  zero import changes.
- **Deployment prerequisite**: Supabase project settings must have
  **Anonymous Sign-Ins enabled** (Authentication → Settings) for
  `signInAnonymously()` to succeed. Without it, `startGameSessionAction`
  fails closed with a friendly error rather than crashing.

---

## 16b. Unified Game Engine *(Implemented -- quiz + spin_wheel)*

The direct answer to "one reusable Game Engine every game should use."
Located at `/play` (same route as 16a; 16a's page now renders this
instead). `components/play/GameEngine.tsx` is a single stage state
machine every playable game runs through -- what differs per `game_type`
is only *which stages are visited*, not the surrounding shell.

**Stage flow** (`type Stage` in `GameEngine.tsx`):

```
intro -> [challenge -> reveal ->] prize -> claim -> thanks
```

- `quiz` visits every stage: `intro -> challenge -> reveal -> prize ->
  claim -> thanks`.
- `spin_wheel` skips the bracketed stages entirely: `intro -> prize ->
  claim -> thanks` -- there's no "question" for a spin wheel; the spin
  itself is both the challenge and the reward, exactly as built in 16a.
- `decoder`/`guess_the_gibberish`/`name_it_to_win_it` (Section 16c) visit
  the exact same stages as `quiz` -- they're routed through the same
  `QUESTION_BASED_TYPES` set, not a parallel code path.
- `claw_machine`/`scratch_card`/`slot_machine` render an `"unsupported"`
  stage instead of `intro` (an honest "not built yet," not a fake
  mechanic) -- unreachable in practice today since `getRandomActiveGame()`
  only ever selects the five implemented types, but handled defensively
  since `game.game_type` is the full 8-value union.

**Requested checklist, and exactly where each item lives:**

| Requested | Component | Notes |
| --- | --- | --- |
| Title | `GameIntro.tsx` | Game name + `GAME_TYPE_LABELS[game.game_type]` eyebrow |
| Mechanics | `GameIntro.tsx` | `game.description` if the admin wrote one, else `GAME_TYPE_MECHANICS_COPY[game.game_type]` (new, `constants/games.ts`) |
| Start button | `GameIntro.tsx` | Calls `startGameSessionAction` (16a, generalized) |
| Random question | `QuizChallenge.tsx` | `getRandomQuestionAction` -> `getRandomQuestionForGame()` (`lib/queries/play.ts`) |
| Countdown timer | `CountdownTimer.tsx` | Generic, reusable; keyed on `question.id` so a new question always resets it |
| Countdown sound | `QuizChallenge.tsx` + `CountdownTimer`'s `onTick` | Reuses the existing `playTick()` (16a's sound engine) for the last 5 seconds -- no new sound was needed |
| Reveal answer | `AnswerReveal.tsx` | Shows the human-readable correct answer (`lib/quiz.ts#describeQuizAnswer`) + explanation, if any |
| You Got It | `AnswerReveal.tsx` | Correct-answer banner, plays `playWin()` |
| Try Again | `AnswerReveal.tsx` | Incorrect-answer banner + retry button (attempt-cap aware) |
| Navigation | `AnswerReveal.tsx` | Continue to Prize Wheel (correct) / Try Again (incorrect, attempts left) / Back to Home (exhausted) |
| Prize wheel | `PrizeStage.tsx` | Reuses `Wheel.tsx` + `spinForPrizeAction` (16a) -- one spin, no "play again" (that concept lives one level up, at the whole-engine "Play Again" on the Thank You screen) |
| Claim flow | `ClaimForm.tsx` | RHF + Zod, calls `claimPrizeAction` -> `claim_prize_win` RPC (new) |
| Thank You screen | `ThankYouScreen.tsx` | Confirms the claim; "Play Again" resets the engine back to `intro` |

**Quiz answer-checking, done safely**: `game_questions.correct_answer` is
admin-only via RLS (Section 4) — a player's client can never read it
directly. `submitQuizAnswerAction` (`lib/actions/quiz.ts`) instead calls a
new `check_quiz_answer` RPC (migration `20260710030000_quiz_and_claim_rpcs.
sql`, `SECURITY DEFINER`), which compares the submission server-side
(exact match for `multiple_choice`/`true_false` since those submit
system-generated tokens; trimmed case-insensitive match for free-typed
`text` answers) and returns `is_correct` + the correct answer + explanation
+ points — never exposing the answer key before a submission exists.

**Bug caught while wiring this up**: `game_questions_public` (the view
built in Phase 2, Section 4) excluded `question_text` along with
`correct_answer`/`explanation` — meaning a player could never actually
see the question they were meant to answer. Nothing had consumed this
view until now, so it went unnoticed. Fixed via migration
`20260710020000_fix_game_questions_public_view.sql` (adds
`question_text` back; `correct_answer`/`explanation` stay excluded).

**Session lifecycle across the two branches**: `submitQuizAnswerAction`
marks the session `completed` itself *only on an incorrect answer* (no
reward stage will ever run for that session). On a correct answer, it
deliberately leaves the session `in_progress` so the *unmodified*
`spinForPrizeAction` (16a) is the single place that transitions a session
to `completed` when a prize is actually drawn — this means one session
is never "finished" by two different code paths.

**Claim flow, done safely (Section 17)**: a plain RLS `UPDATE` policy
letting a player touch their own `winner_records` row would be dangerous
— RLS is row-level, not column-level, so a player could rewrite `prize_id`
or `won_at` on their own row. Instead, `claimPrizeAction` calls a new
`claim_prize_win` RPC (same migration, `SECURITY DEFINER`) that verifies
the caller owns the session behind the win, that it's still `pending`,
and then updates *only* `player_name`/`player_contact`/`status` —
`handle_winner_status_change()` (existing trigger, Section 4) still
stamps `claimed_at` automatically since it fires on any `UPDATE`
regardless of which code path performed it.

**No component duplication**: `QuizChallenge.tsx` and `GameEngine.tsx`
both need to parse `options` (`Json` in the DB) and turn a `correct_answer`
token back into display text — that logic lives once, in `lib/quiz.ts`
(`parseQuizOptions`, `describeQuizAnswer`), imported by both rather than
copy-pasted.

---

## 16c. Decoder, Guess the Gibberish, Name It to Win It *(Implemented)*

Three new player-facing `game_type`s, added directly onto 16b's engine
rather than as parallel systems. All three are, mechanically, the exact
same "random prompt + countdown timer + sound + free-typed answer,
checked server-side" flow `quiz` already runs -- the only per-type
differences are *what the prompt looks like* (plain text, an image, or
both) and whether it carries a `category` tag. No new tables, RPCs,
storage buckets, or Server Actions were needed:

- `games.game_type`'s check constraint widened (migration
  `20260711010000_new_puzzle_game_types.sql`) to add `'decoder'`,
  `'guess_the_gibberish'`, `'name_it_to_win_it'` -- it's a plain `text`
  column with a `check (... in (...))` constraint, not a native Postgres
  enum, so widening it is a normal `drop constraint` / `add constraint`,
  not an `alter type ... add value`.
- `game_questions` gets one new nullable column, `category` (same
  migration) -- used by `name_it_to_win_it` to group images (e.g. "GHS
  Hazard Symbols"); left `null` for every other type.
- **Per-question images already existed** (`game_images.question_id` +
  `image_type = 'question'`, built in Phase 7/Section 7b for admin
  preview) -- `game_questions_public` (the player-facing view) just didn't
  surface them yet. Extended it with a `left join lateral` back to
  `game_images` so `getRandomQuestionForGame()` (`lib/queries/play.ts`)
  can read a question's image (and its `category`) in the same query, with
  no second round trip and no new RLS surface.
- `QuizChallenge.tsx` (the shared challenge-stage component, name kept
  from when only `quiz` used it) renders `question.image_url` front and
  center when set, and a small `question.category` badge above the
  prompt -- both purely additive; `quiz`/`spin_wheel` are unaffected since
  neither field is ever set for them.
- `GameEngine.tsx`'s `SUPPORTED_TYPES` / question-fetch branch became a
  `QUESTION_BASED_TYPES` set (`quiz`, `decoder`, `guess_the_gibberish`,
  `name_it_to_win_it`) instead of a single `=== "quiz"` check --
  `spin_wheel` remains the only supported type with no separate challenge
  stage.
- The "Try Again next time" wording the Name It to Win It brief asked for
  is now the engine-wide copy on `AnswerReveal.tsx`'s retry state (was
  "Try Again") -- one label, every game type, rather than a per-type
  branch for a one-word difference.
- Admin side: `QuestionForm.tsx` gained a `category` text input (with a
  `<datalist>` of `NAME_IT_TO_WIN_IT_CATEGORIES` suggestions, still free
  text) and the CSV template/import gained a matching `category` column
  -- everything else (image upload, question type, timer, points) reuses
  the exact form Phase 7 already built.

**Content — what's real vs. sample:**

| Game | Rounds | Source | Confidence |
| --- | --- | --- | --- |
| Decoder | 72 | Every image from the uploaded deck, copied to `public/game-assets/decoder/`, worked out by hand | 59 high, 13 flagged `-- REVIEW (low confidence)` in the seed migration |
| Guess the Gibberish | 80 | Every phrase from the uploaded deck, phonetically decoded by hand | 77 high/medium, 3 flagged `-- REVIEW (low confidence)` |
| Name It to Win It | 8 | **Sample/dev content, by explicit instruction** -- generic placeholder icons (`public/game-assets/name-it-to-win-it/`, watermarked "SAMPLE IMAGE") across 8 of the 13 requested categories | N/A -- replace via Admin > Games any time |

Both real decks (Decoder, Guess the Gibberish) are seeded via migration
`20260711020000_seed_puzzle_games.sql` as three new `active` games with
their questions and images already attached, so all three are playable at
`/play` immediately -- no manual data entry required. Flagged rows are
ordinary `game_questions` rows; correcting one is editing
`correct_answer` in Admin > Games > (game) > Questions, not a code
change. Name It to Win It intentionally ships with placeholder imagery
per the brief ("I will provide my own image library after the
application is complete") -- its admin CRUD (upload, edit, categorize,
delete) is the same production `QuestionForm.tsx`/`ImageUpload.tsx` every
other game type uses, so swapping in real images later is a normal admin
task, not a follow-up phase.

---

## 16d. Logo Challenge, Chemical Symbol Challenge, True or False, Guess the Unit, Measurement Challenge *(Implemented)*

Five more `game_type`s, same story as 16c: each is the existing engine's
"prompt + countdown + free-typed or true/false answer" challenge, just
with different `question_type` per round and, for `logo_challenge`, an
image via the same `game_images` path Decoder/Name It to Win It already
use. The only schema change (migration
`20260712010000_more_puzzle_game_types.sql`) is widening
`games.game_type`'s check constraint again -- `category` and per-question
images already existed from 16c, and `check_quiz_answer` already handles
every `question_type` these five use (`text` and `true_false`), so no RPC
changes were needed either.

| Game | `question_type` | Example round |
| --- | --- | --- |
| Chemical Symbol Challenge | `text` | "Which element has the chemical symbol \"Fe\"?" -> "Iron" |
| True or False | `true_false` | "The Great Wall of China is visible from space with the naked eye." -> false |
| Guess the Unit | `text` | "What is the SI unit of Force?" -> "Newton" |
| Measurement Challenge | `text` | "How many grams are in 2.5 kilograms? (just the number)" -> "2500" |
| Logo Challenge | `text` + image | (icon shown) -> "Greenline" |

**Content — what's real vs. sample:**

| Game | Rounds | Source |
| --- | --- | --- |
| Chemical Symbol Challenge | 15 | Real periodic table data (elements chosen to have one unambiguous English spelling, avoiding e.g. Aluminum/Aluminium disputes given `check_quiz_answer`'s exact-match comparison for `text` answers) |
| True or False | 15 | Real, fact-checked trivia, each with an `explanation` shown on reveal |
| Guess the Unit | 15 | Real SI units (same single-spelling precaution as above) |
| Measurement Challenge | 12 | Real unit conversions/readings, phrased so the expected answer is an unambiguous bare number |
| Logo Challenge | 8 | **Sample/dev content, same policy as Name It to Win It (16c)**: real company logos are trademarked, so rather than reproduce or imitate anyone's actual mark, these pair 8 simple generic icons (`public/game-assets/logo-challenge/`, watermarked "SAMPLE LOGO") with invented, fictional brand names |

All five are seeded via migration `20260712020000_seed_more_puzzle_games.
sql` as `active` games, playable at `/play` immediately. None of this
content is flagged `-- REVIEW` -- unlike 16c's Decoder/Guess the
Gibberish (which required interpreting someone else's visual/phonetic
puzzles), this content was authored directly and fact-checked, so
confidence is uniformly high. Logo Challenge's fictional brand names
should still be swapped for real, licensed logos before relying on it for
a real promotion -- exactly like Name It to Win It, via the same admin
CRUD, no code changes needed.

---

## 16e. Equipment Match, Which Laboratory, Hazard Symbol, Odd One Out, Word Scramble *(Implemented)*

Five more `game_type`s, same story as 16c/16d -- the only schema change
(migration `20260713010000_more_puzzle_game_types_2.sql`) is widening
`games.game_type`'s check constraint a third time, to 18 total values.
No RPC or column changes were needed: `check_quiz_answer` already handles
`multiple_choice` (exact match against the chosen option's generated id)
exactly as generically as `text`/`true_false`, and per-question images
already existed from 16c. This phase is the first to actually seed
`multiple_choice` content -- every prior game used only `text` or
`true_false` rounds, so the `options` jsonb shape (`[{"id","text"}, ...]`)
described in Section 4/`src/lib/quiz.ts` is now exercised by real seed
data for the first time.

| Game | `question_type` | Example round |
| --- | --- | --- |
| Equipment Match | `multiple_choice` | "Which piece of equipment would you use to measure the precise volume of a liquid?" -> Graduated Cylinder |
| Which Laboratory | `multiple_choice` | "Verifying that a weighing scale reads accurately against a certified reference mass" -> Calibration Laboratory |
| Hazard Symbol | `text` + image | (icon shown) -> "Flammable" |
| Odd One Out | `multiple_choice` | "Beaker, Erlenmeyer Flask, Graduated Cylinder, Bunsen Burner -- which one doesn't belong?" -> Bunsen Burner |
| Word Scramble | `text` | "BAERKE" -> "BEAKER" |

**Content — what's real vs. sample:**

| Game | Rounds | Source |
| --- | --- | --- |
| Equipment Match | 20 | Real lab-equipment/function pairs, directly authored |
| Which Laboratory | 15 | Real laboratory-type classifications (Physical/Chemical/Microbiology/Calibration/Shelf-life/Furniture Testing), directly authored |
| Hazard Symbol | 9 | Real, canonical hazard classes (one per round) -- **sample icons**: see below |
| Odd One Out | 15 | Real categorical groupings across equipment, units, hazard classes, elements, and states of matter, directly authored |
| Word Scramble | 20 | Real science vocabulary (lab equipment and chemistry terms), scrambled programmatically from a fixed word list |

All five are seeded via migration `20260713020000_seed_more_puzzle_games_2.
sql` as `active` games, playable at `/play` immediately. Every question in
this phase was directly authored and fact-checked -- nothing flagged
`-- REVIEW`. Two spelling precautions carried over from 16c/16d's
exact-match `check_quiz_answer` behavior: Word Scramble's word list avoids
any term with more than one common English spelling, and Hazard Symbol
uses "Oxidant" rather than "Oxidizer"/"Oxidiser" for the same reason.

**Hazard Symbol's sample icons:** the 9 icons in
`public/game-assets/hazard-symbol/` (Flammable, Corrosive, Toxic,
Explosive, Compressed Gas, Oxidant, Irritant, Health Hazard, Environmental
Hazard) are original, simplified line-drawings of each concept -- **not**
reproductions of the official GHS pictogram design (the red-diamond
border + specific regulated glyph), since that specific design is
regulated/standardized for compliance labeling. Each is watermarked
"SAMPLE ICON -- replace via admin upload" and should be swapped for
properly licensed official pictograms before this game is used for any
real safety-compliance training, via the same admin CRUD as every other
game type, no code changes needed.

---

## 16f. Emoji Science, Picture Puzzle, Memory Challenge, Spot the Difference, PPE Challenge *(Implemented)*

Five more `game_type`s, same story as 16c/16d/16e -- the only schema
change (migration `20260714010000_more_puzzle_game_types_3.sql`) is
widening `games.game_type`'s check constraint a fourth time, to 23 total
values. No RPC or column changes were needed. This phase introduces a new
shared asset: `scripts/icon_lib.py`, a library of ~40 simple, original
icon-drawing functions (droplet, beaker, flask, goggles, gear, DNA helix,
etc.) that the four image-based games in this phase compose into their
question images -- a single reusable drawing toolkit rather than
one-off art per game, in the same spirit as the project's other shared
`lib/` modules.

| Game | `question_type` | Example round |
| --- | --- | --- |
| Emoji Science | `text` | "Which process do these emoji represent? ☀️ + 🌱" -> Photosynthesis |
| Picture Puzzle | `text` + image | (droplet + shed pictured) -> "Watershed" |
| Memory Challenge | `multiple_choice` + image | (beaker/flask/thermometer/magnet pictured) -> "Which was NOT shown?" -> Test Tube |
| Spot the Difference | `multiple_choice` + image | (3 beakers vs. 4 beakers pictured) -> "There is one extra beaker in Image B" |
| PPE Challenge | `text` + image | (goggles pictured) -> "Safety Goggles" |

**Content — what's real vs. sample:**

| Game | Rounds | Source |
| --- | --- | --- |
| Emoji Science | 20 | Real science concepts (states of matter, senses, forces, body systems), directly authored; each question is framed ("Which state change/force/sense/...") to keep the expected answer unambiguous |
| Picture Puzzle | 10 | Real compound science terms (Watershed, Sunlight, Earthquake, Microscope, Eco