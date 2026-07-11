create table if not exists public.winner_records (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references public.game_sessions (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  prize_id uuid not null references public.prizes (id) on delete restrict,
  player_name text,
  player_contact text,
  status text not null default 'pending' check (status in ('pending', 'claimed', 'expired', 'cancelled')),
  won_at timestamptz not null default now(),
  claimed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_winner_records_session_id on public.winner_records (game_session_id);
create index if not exists idx_winner_records_game_id on public.winner_records (game_id);
create index if not exists idx_winner_records_prize_id on public.winner_records (prize_id);
create index if not exists idx_winner_records_status on public.winner_records (status);
create index if not exists idx_winner_records_won_at on public.winner_records (won_at);

create trigger trg_winner_records_updated_at
  before update on public.winner_records
  for each row
  execute function public.set_updated_at();

-- Automatic timestamping: stamp claimed_at / cancelled_at on status transitions.
create or replace function public.handle_winner_status_change()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'claimed' and old.status <> 'claimed' and new.claimed_at is null then
    new.claimed_at = now();
  end if;

  if new.status = 'cancelled' and old.status <> 'cancelled' and new.cancelled_at is null then
    new.cancelled_at = now();
  end if;

  return new;
end;
$$;

create trigger trg_winner_records_status
  before update on public.winner_records
  for each row
  execute function public.handle_winner_status_change();

--------------------------------------------------------------------------------
-- Automatic inventory deduction
--------------------------------------------------------------------------------
-- Locks the relevant prize_inventory row, verifies stock, and deducts one unit
-- atomically. Runs BEFORE INSERT so an out-of-stock prize aborts the insert
-- (and therefore the win) instead of recording a win with nothing to give out.
-- SECURITY DEFINER lets this run even though the calling role (a player) has
-- no direct UPDATE grant on prize_inventory.
create or replace function public.handle_prize_win()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_available integer;
begin
  select quantity_available into v_available
  from public.prize_inventory
  where prize_id = new.prize_id
  for update;

  if v_available is null then
    raise exception 'No inventory record exists for prize %', new.prize_id;
  end if;

  if v_available <= 0 then
    raise exception 'Prize % is out of stock', new.prize_id;
  end if;

  update public.prize_inventory
  set quantity_awarded = quantity_awarded + 1
  where prize_id = new.prize_id;

  return new;
end;
$$;

create trigger trg_deduct_prize_inventory
  before insert on public.winner_records
  for each row
  execute function public.handle_prize_win();

-- Automatic restock if a win is later cancelled or removed.
create or replace function public.handle_prize_restock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'DELETE' then
    update public.prize_inventory
    set quantity_awarded = greatest(quantity_awarded - 1, 0)
    where prize_id = old.prize_id;
    return old;
  end if;

  if TG_OP = 'UPDATE' then
    if new.status = 'cancelled' and old.status <> 'cancelled' then
      update public.prize_inventory
      set quantity_awarded = greatest(quantity_awarded - 1, 0)
      where prize_id = new.prize_id;
    end if;
    return new;
  end if;

  return null;
end;
$$;

create trigger trg_restock_on_winner_delete
  after delete on public.winner_records
  for each row
  execute function public.handle_prize_restock();

create trigger trg_restock_on_winner_cancel
  after update on public.winner_records
  for each row
  execute function public.handle_prize_restock();

comment on table public.winner_records is
  'A recorded prize win tied to a game session. Inserting a row automatically deducts prize_inventory; cancelling or deleting automatically restocks.';
