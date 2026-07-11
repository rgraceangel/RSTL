create table if not exists public.prize_inventory (
  id uuid primary key default gen_random_uuid(),
  prize_id uuid not null unique references public.prizes (id) on delete cascade,
  quantity_total integer not null default 0 check (quantity_total >= 0),
  quantity_awarded integer not null default 0 check (quantity_awarded >= 0),
  quantity_available integer generated always as (quantity_total - quantity_awarded) stored,
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  last_restocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prize_inventory_awarded_lte_total check (quantity_awarded <= quantity_total)
);

create index if not exists idx_prize_inventory_prize_id on public.prize_inventory (prize_id);
create index if not exists idx_prize_inventory_low_stock
  on public.prize_inventory (quantity_available)
  where quantity_available <= low_stock_threshold;

create trigger trg_prize_inventory_updated_at
  before update on public.prize_inventory
  for each row
  execute function public.set_updated_at();

comment on table public.prize_inventory is
  'Stock tracking per prize. quantity_available is computed and automatically maintained by winner_records triggers.';
