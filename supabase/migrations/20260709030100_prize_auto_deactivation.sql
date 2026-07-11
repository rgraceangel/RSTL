-- Automatic removal from availability when stock hits zero: as soon as a
-- prize_inventory row's computed quantity_available drops to 0 or below
-- (via a win, a manual edit, etc.), flip the parent prize to inactive so it
-- stops showing up as available. Restocking does NOT automatically
-- reactivate it -- an admin re-enables it deliberately once stock is back,
-- which doubles as a final sanity check before it's offered again.
create or replace function public.handle_zero_stock_deactivation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.quantity_available <= 0 then
    update public.prizes
    set is_active = false
    where id = new.prize_id and is_active = true;
  end if;

  return new;
end;
$$;

create trigger trg_prize_inventory_zero_stock
  after insert or update on public.prize_inventory
  for each row
  execute function public.handle_zero_stock_deactivation();

comment on function public.handle_zero_stock_deactivation() is
  'Sets prizes.is_active = false automatically whenever prize_inventory.quantity_available reaches 0.';
