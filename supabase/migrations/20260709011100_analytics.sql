create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games (id) on delete cascade,
  metric_name text not null,
  metric_value numeric not null default 0,
  dimensions jsonb not null default '{}'::jsonb,
  recorded_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Treat NULL game_id ("global" metrics) as a single group for uniqueness.
create unique index if not exists idx_analytics_unique_metric
  on public.analytics (
    coalesce(game_id, '00000000-0000-0000-0000-000000000000'::uuid),
    metric_name,
    recorded_date
  );

create index if not exists idx_analytics_game_id on public.analytics (game_id);
create index if not exists idx_analytics_recorded_date on public.analytics (recorded_date);

create trigger trg_analytics_updated_at
  before update on public.analytics
  for each row
  execute function public.set_updated_at();

comment on table public.analytics is
  'Aggregated daily metrics per game (or global when game_id is null). Typically written by scheduled jobs using the service_role key.';
