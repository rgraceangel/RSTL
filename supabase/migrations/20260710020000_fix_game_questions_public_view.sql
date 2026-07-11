--------------------------------------------------------------------------------
-- Bug fix: `game_questions_public` (20260709011500_public_views.sql) excluded
-- `question_text` along with `correct_answer`/`explanation` -- but the
-- question text itself is exactly what a player needs to see to answer at
-- all. It went unnoticed because nothing consumed this view until the real
-- Quiz challenge (Section 16a/16b) was built. `correct_answer` and
-- `explanation` remain excluded; only the missing question text is added.
--------------------------------------------------------------------------------

create or replace view public.game_questions_public as
select
  id,
  game_id,
  question_text,
  question_type,
  options,
  points,
  order_index,
  time_limit_seconds,
  created_at
from public.game_questions;

comment on view public.game_questions_public is
  'Safe, public-facing projection of game_questions with correct_answer and explanation removed. question_text is included (fixed -- was originally missing).';
