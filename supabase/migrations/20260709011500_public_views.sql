--------------------------------------------------------------------------------
-- Public-safe views. Views run with the privileges of their owner (the
-- migration role, e.g. postgres) by default, which is how these can expose a
-- filtered slice of an otherwise admin-locked table to anon/authenticated
-- clients without ever loosening the base table's RLS policies.
--------------------------------------------------------------------------------

-- Quiz questions without the answer key.
create or replace view public.game_questions_public as
select
  id,
  game_id,
  question_type,
  options,
  points,
  order_index,
  time_limit_seconds,
  created_at
from public.game_questions;

grant select on public.game_questions_public to anon, authenticated;

comment on view public.game_questions_public is
  'Safe, public-facing projection of game_questions with correct_answer and explanation removed.';

-- Recent winners feed for marketing/display purposes, with player names masked.
create or replace view public.recent_winners_feed as
select
  wr.id,
  g.name as game_name,
  p.name as prize_name,
  left(coalesce(wr.player_name, 'Player'), 1)
    || repeat('*', greatest(length(coalesce(wr.player_name, 'Player')) - 1, 0)) as player_display,
  wr.won_at
from public.winner_records wr
join public.games g on g.id = wr.game_id
join public.prizes p on p.id = wr.prize_id
where wr.status in ('claimed', 'pending')
order by wr.won_at desc
limit 50;

grant select on public.recent_winners_feed to anon, authenticated;

comment on view public.recent_winners_feed is
  'Public feed of recent winners with masked player names, for marketing/display widgets.';
