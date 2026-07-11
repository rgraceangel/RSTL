--------------------------------------------------------------------------------
-- Bug fix (found during a full-project test/audit pass): the two earlier
-- `create or replace view public.game_questions_public` statements --
-- `20260710020000_fix_game_questions_public_view.sql` and
-- `20260711010000_new_puzzle_game_types.sql` -- each inserted new columns
-- in the *middle* of the view's column list:
--
--   v1 (20260709011500): id, game_id, question_type, options, points, ...
--   v2 (20260710020000): id, game_id, question_text, question_type, ...
--                                      ^^^^^^^^^^^^^ inserted before
--                                      question_type, not appended at the end
--   v3 (20260711010000): ... time_limit_seconds, category, image_url, created_at
--                                                ^^^^^^^^^^^^^^^^^^^^ inserted
--                                                before created_at, not after it
--
-- PostgreSQL's `CREATE OR REPLACE VIEW` only allows new columns to be
-- appended after the existing ones -- it rejects renaming, reordering, or
-- inserting a column ahead of an existing one ("cannot change name of view
-- column ... to ...") . Both v2 and v3 would fail outright the moment a
-- fresh database ran `supabase db push` top to bottom, which is exactly why
-- this was never caught by the SQL-structure checks (sqlparse statement/
-- row counts) used to verify earlier phases -- those never execute the SQL
-- against a real Postgres server, only parse it. This is the first pass
-- that actually reasoned through Postgres's view-column-compatibility rule
-- statement by statement.
--
-- Fix: drop and recreate the view instead of `create or replace`, which
-- sidesteps the column-order restriction entirely. Nothing else in the
-- schema depends on this view (grep confirms only a comment reference in
-- row_level_security.sql), so a plain `drop view` (no `cascade` needed) is
-- safe. Final shape matches what v3 intended and what the app already reads
-- (`lib/queries/play.ts#getRandomQuestionForGame`, `types/supabase.ts`).
--------------------------------------------------------------------------------

drop view if exists public.game_questions_public;

create view public.game_questions_public as
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
  'Safe, public-facing projection of game_questions (+ its question-level image via game_images) with correct_answer and explanation removed. Recreated via DROP+CREATE (not CREATE OR REPLACE) in this migration because the two prior versions inserted columns mid-list, which CREATE OR REPLACE VIEW cannot do.';
