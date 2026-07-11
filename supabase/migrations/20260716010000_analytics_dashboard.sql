--------------------------------------------------------------------------------
-- Section 17: Analytics dashboard support.
--
-- 1. `game_sessions.answer_correct` -- the one column the schema was missing
--    to answer "how many correct vs incorrect answers" honestly. Before this,
--    `score` was the only per-session outcome column, and it is never set to
--    anything but 0 (see lib/actions/quiz.ts) -- a correct answer leaves
--    `score` untouched at its default, indistinguishable from "not answered
--    yet". `answer_correct` is stamped by `submitQuizAnswerAction` the moment
--    a question-based challenge (any type in GameEngine's QUESTION_BASED_TYPES)
--    is answered, independent of `status`. It stays null forever for
--    `spin_wheel` sessions, which have no question to answer.
--
-- 2. Six admin-only, SECURITY DEFINER read RPCs backing `/admin/analytics`.
--    Each does its own `count(*) filter (...)`/`group by` aggregation in
--    Postgres rather than pulling every `game_sessions`/`winner_records` row
--    into application code the way `queries/dashboard.ts#getDashboardStats`
--    deliberately does as a documented stopgap ("fine at this scale... move
--    to a Postgres RPC once volume grows") -- PostgREST's query builder has
--    no `group by`, and Analytics is exactly the workload that stopgap was
--    written to be superseded for. Every RPC re-checks `is_admin()` itself
--    (defense in depth: only the protected `/admin` route calls these today,
--    but the authorization decision belongs in the database, not just in
--    Next.js middleware).
--------------------------------------------------------------------------------

alter table public.game_sessions
  add column if not exists answer_correct boolean;

comment on column public.game_sessions.answer_correct is
  'True/false the instant a question-based challenge is answered (stamped by submitQuizAnswerAction), independent of session status. Null for spin_wheel sessions (no question) and for sessions that never reached an answer.';

create index if not exists idx_game_sessions_answer_correct
  on public.game_sessions (answer_correct)
  where answer_correct is not null;

--------------------------------------------------------------------------------
-- 1. Games played summary
--------------------------------------------------------------------------------
create or replace function public.get_games_played_summary()
returns table (
  total_sessions bigint,
  completed_sessions bigint,
  in_progress_sessions bigint,
  abandoned_sessions bigint,
  sessions_today bigint,
  sessions_last_7_days bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  return query
    select
      count(*) as total_sessions,
      count(*) filter (where status = 'completed') as completed_sessions,
      count(*) filter (where status = 'in_progress') as in_progress_sessions,
      count(*) filter (where status = 'abandoned') as abandoned_sessions,
      count(*) filter (where started_at >= date_trunc('day', now())) as sessions_today,
      count(*) filter (where started_at >= now() - interval '7 days') as sessions_last_7_days
    from public.game_sessions;
end;
$$;

grant execute on function public.get_games_played_summary() to authenticated;

comment on function public.get_games_played_summary is
  'Admin-only. Total play attempts broken down by session status, plus today/7-day rollups, for the Analytics dashboard "Games Played" card.';

--------------------------------------------------------------------------------
-- 2. Answer accuracy (correct vs incorrect)
--------------------------------------------------------------------------------
create or replace function public.get_answer_accuracy_summary()
returns table (
  correct_answers bigint,
  incorrect_answers bigint,
  accuracy_rate numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  return query
    select
      count(*) filter (where answer_correct = true) as correct_answers,
      count(*) filter (where answer_correct = false) as incorrect_answers,
      case when count(*) filter (where answer_correct is not null) > 0
        then round(
          (count(*) filter (where answer_correct = true))::numeric
          / count(*) filter (where answer_correct is not null) * 100,
          1
        )
        else 0
      end as accuracy_rate
    from public.game_sessions;
end;
$$;

grant execute on function public.get_answer_accuracy_summary() to authenticated;

comment on function public.get_answer_accuracy_summary is
  'Admin-only. Correct vs incorrect counts across every question-based challenge ever answered (game_sessions.answer_correct), plus the resulting accuracy rate.';

--------------------------------------------------------------------------------
-- 3. Prizes claimed
--------------------------------------------------------------------------------
create or replace function public.get_prize_claim_summary()
returns table (
  total_won bigint,
  claimed bigint,
  pending bigint,
  expired bigint,
  cancelled bigint,
  claim_rate numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  return query
    select
      count(*) as total_won,
      count(*) filter (where status = 'claimed') as claimed,
      count(*) filter (where status = 'pending') as pending,
      count(*) filter (where status = 'expired') as expired,
      count(*) filter (where status = 'cancelled') as cancelled,
      case when count(*) > 0
        then round((count(*) filter (where status = 'claimed'))::numeric / count(*) * 100, 1)
        else 0
      end as claim_rate
    from public.winner_records;
end;
$$;

grant execute on function public.get_prize_claim_summary() to authenticated;

comment on function public.get_prize_claim_summary is
  'Admin-only. winner_records broken down by status, plus the claim rate (claimed / total_won), for the Analytics "Prizes Claimed" card.';

--------------------------------------------------------------------------------
-- 4. Inventory report
--------------------------------------------------------------------------------
create or replace function public.get_prize_inventory_report()
returns table (
  prize_id uuid,
  prize_name text,
  prize_type text,
  is_active boolean,
  quantity_total integer,
  quantity_awarded integer,
  quantity_available integer,
  low_stock_threshold integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  return query
    select
      p.id,
      p.name,
      p.prize_type,
      p.is_active,
      pi.quantity_total,
      pi.quantity_awarded,
      pi.quantity_available,
      pi.low_stock_threshold
    from public.prizes p
    join public.prize_inventory pi on pi.prize_id = p.id
    order by pi.quantity_available asc, p.name asc;
end;
$$;

grant execute on function public.get_prize_inventory_report() to authenticated;

comment on function public.get_prize_inventory_report is
  'Admin-only. One row per prize with full stock detail (prize_inventory itself has no direct player- or dashboard-facing read policy), lowest stock first.';

--------------------------------------------------------------------------------
-- 5. Most popular games
--------------------------------------------------------------------------------
create or replace function public.get_most_popular_games(p_limit integer default 10)
returns table (
  game_id uuid,
  game_name text,
  game_type text,
  sessions_count bigint,
  win_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  -- Two independent left joins off the same `games` row (sessions, wins) --
  -- count(distinct ...) is required, not optional, here: without it, each
  -- game's session count would be multiplied by its win count (and vice
  -- versa) from the join's cartesian fan-out whenever a game has more than
  -- one row on both sides.
  return query
    select
      g.id,
      g.name,
      g.game_type,
      count(distinct gs.id) as sessions_count,
      count(distinct wr.id) as win_count
    from public.games g
    left join public.game_sessions gs on gs.game_id = g.id
    left join public.winner_records wr on wr.game_id = g.id and wr.status <> 'cancelled'
    group by g.id, g.name, g.game_type
    order by sessions_count desc, g.name asc
    limit greatest(p_limit, 1);
end;
$$;

grant execute on function public.get_most_popular_games(integer) to authenticated;

comment on function public.get_most_popular_games is
  'Admin-only. Every game ranked by total sessions played (ties broken alphabetically), with each game''s non-cancelled win count alongside it. Powers the Analytics "Most Popular Game" chart.';

--------------------------------------------------------------------------------
-- 6. Daily participation (time series)
--------------------------------------------------------------------------------
create or replace function public.get_daily_participation(p_days integer default 30)
returns table (
  day date,
  sessions_count bigint,
  completed_count bigint,
  winners_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  -- Same cartesian-fan-out concern as get_most_popular_games above: two
  -- independent left joins (sessions, wins) onto the same `days` row means
  -- count(distinct ...) is mandatory, not stylistic.
  return query
    with days as (
      select generate_series(
        current_date - (greatest(p_days, 1) - 1),
        current_date,
        interval '1 day'
      )::date as day
    )
    select
      d.day,
      count(distinct gs.id) as sessions_count,
      count(distinct gs.id) filter (where gs.status = 'completed') as completed_count,
      count(distinct wr.id) filter (where wr.status <> 'cancelled') as winners_count
    from days d
    left join public.game_sessions gs on gs.started_at::date = d.day
    left join public.winner_records wr on wr.won_at::date = d.day
    group by d.day
    order by d.day asc;
end;
$$;

grant execute on function public.get_daily_participation(integer) to authenticated;

comment on function public.get_daily_participation is
  'Admin-only. One row per calendar day (default: trailing 30 days, including days with zero activity) with sessions/completed/winners counts. Powers the Analytics "Daily Participation" chart.';
