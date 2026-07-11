--------------------------------------------------------------------------------
-- Public-safe view exposing which prizes are actually spinnable right now.
-- `prize_inventory` itself stays admin-only (see row_level_security.sql), so
-- the player-facing Spin Wheel component reads *availability* through this
-- view instead of ever touching prize_inventory directly -- exact stock
-- counts remain admin-only, only a boolean-shaped "is in stock" filter is
-- exposed.
--------------------------------------------------------------------------------

create or replace view public.available_prizes_for_wheel as
select
  p.id,
  p.name,
  p.image_url,
  p.prize_type,
  p.probability_weight,
  p.created_at
from public.prizes p
join public.prize_inventory pi on pi.prize_id = p.id
where p.is_active = true
  and pi.quantity_available > 0;

grant select on public.available_prizes_for_wheel to anon, authenticated;

comment on view public.available_prizes_for_wheel is
  'Active, in-stock prizes -- the only prizes the public Spin Wheel may ever land on. Excludes raw quantity_available so exact inventory counts stay admin-only.';
