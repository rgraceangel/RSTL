create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  game_type text not null check (game_type in ('quiz', 'spin_wheel', 'claw_machine', 'scratch_card', 'slot_machine')),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  thumbnail_url text,
  max_attempts_per_user integer not null default 1 check (max_attempts_per_user > 0),
  config jsonb not null default '{}'::jsonb,
  start_date timestamptz,
  end_date timestamptz,
  created_by uuid references public.admins (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint games_date_range_check check (end_date is null or start_date is null or end_date > start_date)
);

create index if not exists idx_games_status on public.games (status);
create index if not exists idx_games_game_type on public.games (game_type);
create index if not exists idx_games_created_by on public.games (created_by);
create index if not exists idx_games_active_window on public.games (status, start_date, end_date);

create trigger trg_games_updated_at
  before update on public.games
  for each row
  execute function public.set_updated_at();

comment on table public.games is
  'Configurable game instances (quiz, spin wheel, claw machine, etc.) that players can play.';
