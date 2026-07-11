# Database Schema

Supabase/Postgres schema for the game + prize platform. Migrations live in
`supabase/migrations/`, applied in filename order via the Supabase CLI
(`supabase db push` or `supabase migration up`).

## Applying the migrations

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

After applying, regenerate the TypeScript types that back `src/types/supabase.ts`:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > src/types/supabase.ts
```

### Bootstrapping the first admin

Every write policy on `admins` requires an existing `super_admin`, so the very
first row can't be created through the normal (RLS-protected) client. Insert
it once using the `service_role` key (bypasses RLS) — e.g. from the Supabase
SQL editor:

```sql
insert into public.admins (user_id, full_name, email, role)
values ('<auth.users.id of the account>', 'Founding Admin', 'you@example.com', 'super_admin');
```

## Entity overview

```
auth.users
   │ 1:1
   ▼
admins ──────────────┐
   │ 1:N (created_by) │ 1:N (updated_by)
   ▼                  ▼
games                settings
   │ 1:N
   ├──────────────► game_questions ──┐
   │                                 │ 1:N (question_id, nullable)
   ├──────────────► game_images ◄────┘
   │ 1:N
   ▼
game_sessions ◄── auth.users (player_id, anonymous sign-in supported)
   │ 1:N
   ▼
winner_records ──► prizes ──► prize_inventory (1:1)

activity_logs ◄── written automatically from games, game_questions, prizes,
                   prize_inventory, winner_records, settings

analytics ──► games (nullable game_id = global metric)
```

## Tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `admins` | Back-office users | `user_id` → `auth.users`, `role` (`super_admin`/`admin`/`moderator`) |
| `games` | Game configuration | `slug`, `game_type`, `status`, `config` (jsonb), `created_by` → `admins` |
| `game_questions` | Quiz questions per game | `game_id` → `games`, `options` (jsonb), `correct_answer`, `order_index` |
| `game_images` | Banners/thumbnails/question images | `game_id` → `games`, `question_id` → `game_questions` (nullable) |
| `prizes` | Prize catalog | `prize_type`, `value`, `probability_weight`, `is_active` |
| `prize_inventory` | Stock per prize | `prize_id` → `prizes` (1:1), `quantity_total`, `quantity_awarded`, generated `quantity_available` |
| `game_sessions` | One row per play-through | `game_id` → `games`, `player_id` → `auth.users`, `status`, `score` |
| `winner_records` | A recorded prize win | `game_session_id` → `game_sessions`, `game_id` → `games`, `prize_id` → `prizes`, `status` |
| `analytics` | Aggregated daily metrics | `game_id` → `games` (nullable = global), `metric_name`, `metric_value`, `recorded_date` |
| `activity_logs` | Immutable audit trail | `admin_id` → `admins`, `action`, `entity_type`, `entity_id`, `details` (jsonb) |
| `settings` | App configuration | `key` (unique), `value` (jsonb), `is_public` |

## Relationships

- `admins.user_id` → `auth.users.id` (1:1)
- `games.created_by` → `admins.id` (N:1, `on delete set null`)
- `game_questions.game_id` → `games.id` (N:1, `on delete cascade`)
- `game_images.game_id` → `games.id`, `game_images.question_id` → `game_questions.id` (both `on delete cascade`)
- `prize_inventory.prize_id` → `prizes.id` (1:1, `on delete cascade`)
- `game_sessions.game_id` → `games.id` (`on delete cascade`); `game_sessions.player_id` → `auth.users.id` (`on delete set null`)
- `winner_records.game_session_id` → `game_sessions.id` (`on delete cascade`); `winner_records.game_id` → `games.id` (`on delete cascade`); `winner_records.prize_id` → `prizes.id` (`on delete restrict` — a prize with recorded wins can't be deleted outright)
- `analytics.game_id` → `games.id` (nullable, `on delete cascade`)
- `activity_logs.admin_id` → `admins.id` (`on delete set null`)
- `settings.updated_by` → `admins.id` (`on delete set null`)

## Indexes

Every foreign key has a supporting index. Notable additions beyond the obvious:

- `games (status, start_date, end_date)` — composite index for "currently active" lookups
- `game_questions (game_id, order_index)` — unique, enforces question ordering per game
- `prize_inventory (quantity_available) where quantity_available <= low_stock_threshold` — partial index for low-stock dashboards
- `analytics (coalesce(game_id, '00000000-…'), metric_name, recorded_date)` — unique index that treats a null `game_id` (global metric) as its own group, since Postgres would otherwise treat every `NULL` as distinct
- `activity_logs (entity_type, entity_id)` — composite index for "show history of this record"

## Triggers

**Automatic timestamping**

- `set_updated_at()` — generic `BEFORE UPDATE` function that sets `updated_at = now()`; attached to every table that has an `updated_at` column (all except `activity_logs`, which is append-only).
- `handle_session_end()` — stamps `game_sessions.ended_at` the moment `status` moves out of `in_progress`.
- `handle_winner_status_change()` — stamps `winner_records.claimed_at` / `cancelled_at` on the corresponding status transition.

**Automatic inventory deduction** (`winner_records` → `prize_inventory`)

- `handle_prize_win()` — `BEFORE INSERT` on `winner_records`. Locks the prize's `prize_inventory` row (`SELECT … FOR UPDATE`), raises an exception if stock is missing or `quantity_available <= 0` (aborting the insert — no win is recorded without stock to back it), otherwise increments `quantity_awarded` by 1. Runs `SECURITY DEFINER` so it works even though the calling role (a player) has no direct `UPDATE` grant on `prize_inventory`. The row lock means two concurrent wins for the last unit of a prize can't both succeed.
- `handle_prize_restock()` — `AFTER UPDATE OR DELETE` on `winner_records`. If a win is cancelled (`status` → `cancelled`) or deleted, decrements `quantity_awarded` back down (floor at 0), returning the unit to available stock.

**Audit logging**

- `log_activity()` — generic `AFTER INSERT OR UPDATE OR DELETE` function that writes a row to `activity_logs` (looking up the acting admin via `auth.uid()`, capturing the full new/old row as `details`). Attached to `games`, `game_questions`, `prizes`, `prize_inventory`, `winner_records`, and `settings`.

## Row Level Security

RLS is enabled on every table; with no matching policy a command is denied by
default. Two helper functions drive most policies:

- `is_admin()` — true if `auth.uid()` matches an active row in `admins` (any role)
- `is_super_admin()` — true if that row's `role = 'super_admin'`

Summary by table:

- **admins** — a user can read their own row; only super admins can read all rows or write (insert/update/delete) any row.
- **games** — public can read `status = 'active'` games; admins can read/write everything.
- **game_questions** — admin-only at the table level (protects `correct_answer`). Public clients read via the `game_questions_public` view instead.
- **game_images** — public can read images belonging to an active game; admins manage everything.
- **prizes** — public can read `is_active = true` prizes; admins manage everything.
- **prize_inventory** — admin-only in both directions. The deduction/restock triggers are `SECURITY DEFINER`, so they bypass this even when triggered by a non-admin player action.
- **game_sessions** — a player (via `auth.uid()`, anonymous sign-in included) can create their own session, read it, and update it while still `in_progress`; admins can read/update/delete any session.
- **winner_records** — a player can insert a win only for their own `completed` session (on top of the inventory trigger's stock check); a player can read their own wins; admins manage everything.
- **analytics** — admin-only (expected to be populated by scheduled jobs using the `service_role` key, which bypasses RLS entirely).
- **activity_logs** — admins can read and insert; no update/delete policy exists for any role, making the log immutable by construction.
- **settings** — public can read rows where `is_public = true`; admins manage everything.

## Public views

Three views expose safe, filtered data to `anon`/`authenticated` roles
without loosening the underlying tables' RLS:

- `game_questions_public` — same as `game_questions` minus `correct_answer` and `explanation`, plus a `left join lateral` back to `game_images` (question-level `image_url`, `image_type = 'question'`) so the player Game Engine can read a question's image without a second query or a new RLS surface. Also carries `category` (Section 16c) for `name_it_to_win_it`'s image groupings.
- `recent_winners_feed` — recent wins joined with game/prize names, with player names masked (`J*****`), for a public "recent winners" marketing widget.
- `available_prizes_for_wheel` — active, in-stock prizes (joins `prizes`/`prize_inventory`), used both to render the Prize Wheel's segments and as the aut