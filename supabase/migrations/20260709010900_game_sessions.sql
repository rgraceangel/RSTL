create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  player_id uuid references auth.users (id) on delete set null,
  player_name text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  score integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_game_sessions_game_id on public.game_sessions (game_id);
create index if not exists idx_game_sessions_player_id on public.game_sessions (player_id);
create index if not exists idx_game_sessions_status on public.game_sessions (status);
create index if not exists idx_game_sessions_started_at on public.game_sessions (started_at);

create trigger trg_game_sessions_updated_at
  before update on public.game_sessions
  for each row
  execute function public.set_updated_at();

-- Automatic timestamping: stamp ended_at the moment a session leaves 'in_progress'.
create or replace function public.handle_session_end()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('completed', 'abandoned')
     and old.status = 'in_progress'
     and new.ended_at is null then
    new.ended_at = now();
  end if;
  return new;
end;
$$;

create trigger trg_game_sessions_end
  before update on public.game_sessions
  for each row
  execute function public.handle_session_end();

comment on table public.game_sessions is
  'One row per play-through. player_id references a Supabase auth user (anonymous sign-in supported).';
