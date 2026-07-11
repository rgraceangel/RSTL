--------------------------------------------------------------------------------
-- Bug fix (found during a full-project test/audit pass): `restockPrizeAction`
-- (lib/actions/prizes.ts) previously did a classic read-modify-write race --
-- `select quantity_total`, add `amount` in application code, then `update`
-- with the computed value. Two concurrent restocks of the same prize (two
-- admin tabs, a double-submit, or a retried request) can both read the same
-- starting value and the second write silently clobbers the first, losing
-- stock instead of adding to it. This RPC does the increment as a single
-- atomic `update ... set quantity_total = quantity_total + p_amount`
-- statement -- Postgres evaluates and row-locks that in one step, so there's
-- no window between "read" and "write" for another transaction to land in.
--------------------------------------------------------------------------------

create or replace function public.restock_prize(p_prize_id uuid, p_amount integer)
returns table (quantity_total integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Restock amount must be a positive number';
  end if;

  update public.prize_inventory pi
  set quantity_total = pi.quantity_total + p_amount,
      last_restocked_at = now()
  where pi.prize_id = p_prize_id;

  if not found then
    raise exception 'No inventory record found for this prize';
  end if;

  return query
    select pi.quantity_total from public.prize_inventory pi where pi.prize_id = p_prize_id;
end;
$$;

grant execute on function public.restock_prize(uuid, integer) to authenticated;

comment on function public.restock_prize is
  'Admin-only. Atomically adds p_amount to a prize''s quantity_total in a single UPDATE statement, avoiding the read-then-write race a select-then-update in application code would have.';
