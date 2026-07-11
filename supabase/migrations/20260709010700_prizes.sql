create table if not exists public.prizes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  prize_type text not null default 'physical' check (prize_type in ('physical', 'digital', 'voucher', 'points')),
  value numeric(10, 2) not null default 0 check (value >= 0),
  probability_weight numeric(6, 4) not null default 0 check (probability_weight >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_prizes_is_active on public.prizes (is_active);
create index if not exists idx_prizes_prize_type on public.prizes (prize_type);

create trigger trg_prizes_updated_at
  before update on public.prizes
  for each row
  execute function public.set_updated_at();

comment on table public.prizes is
  'Prize catalog. Stock levels live in prize_inventory, not here.';
