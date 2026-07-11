--------------------------------------------------------------------------------
-- Section 16c: three new player-facing game types --
--   'decoder'             -- image-based rebus puzzles, free-text answer
--   'guess_the_gibberish'  -- phonetic-spelling puzzles, free-text answer
--   'name_it_to_win_it'   -- timed "name the pictured item" quiz, categorized
--
-- Mechanically all three are just the existing `quiz` engine with
-- question_type = 'text': a prompt (text and/or image) + countdown timer +
-- free-typed answer, checked by the existing check_quiz_answer RPC. No new
-- tables, RPCs, or storage buckets are needed -- `game_questions` already
-- carries question_text/options/correct_answer/points/time_limit_seconds,
-- and `game_images` (question_id, image_type = 'question') already stores a
-- per-question image with public read access for active games. This
-- migration only widens `games.game_type`, adds an optional `category` tag
-- to `game_questions` (used by Name It To Win It's image categories), and
-- extends `game_questions_public` to surface both.
--------------------------------------------------------------------------------

alter table public.games drop constraint if exists games_game_type_check;
alter table public.games add constraint games_game_type_check
  check (game_type in (
    'quiz',
    'spin_wheel',
    'claw_machine',
    'scratch_card',
    'slot_machine',
    'decoder',
    'guess_the_gibberish',
    'name_it_to_win_it'
  ));

alter table public.game_questions add column if not exists category text;

comment on column public.game_questions.category is
  'Optional free-form category/tag. Used by name_it_to_win_it to group images (e.g. "GHS Hazard Symbols", "Philippine Regulatory Agency Logos"); left null for other game types.';

-- Recreate the public projection (originally created in
-- 20260709011500_public_views.sql, fixed in
-- 20260710020000_fix_game_questions_public_view.sql) to also expose
-- `category` and a per-question `image_url` sourced from game_images --
-- the player Game Engine needs both to render Decoder/Name It To Win It's
-- image-driven challenge stage, and it must never read game_questions or
-- game_images directly for that (correct_answer stays hidden either way,
-- but keeping one read path is simpler than teaching the client two ways
-- to fetch the same question).
create or replace view public.game_questions_public as
select
  gq.id,
  gq.game_id,
  gq.question_text,
  gq.question_type,
  gq.options,
  gq.points,
  gq.order_index,
  gq.time_limit_seconds,
  gq.category,
  gi.image_url,
  gq.created_at
from public.game_questions gq
left join lateral (
  select image_url
  from public.game_images
  where question_id = gq.id and image_type = 'question'
  order by display_order asc, created_at asc
  limit 1
) gi on true;

grant select on public.game_questions_public to anon, authenticated;

comment on view public.game_questions_public is
  'Safe, public-facing projection of game_questions (+ its question-level image via game_images) with correct_answer and explanation removed.';
