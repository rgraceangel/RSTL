--------------------------------------------------------------------------------
-- Two SECURITY DEFINER RPCs backing the real Game Engine (Section 16b):
--
-- 1. check_quiz_answer -- lets a player submit a guess and find out if it's
--    correct WITHOUT ever exposing game_questions.correct_answer to the
--    client beforehand. game_questions itself is admin-only via RLS (the
--    correct_answer column is sensitive), so this can't be a plain
--    supabase-js .select() -- it has to run with elevated privileges,
--    check server-side, and hand back only what's safe to reveal *after*
--    the player has already committed to their own answer.
--
-- 2. claim_prize_win -- lets a player attach their name/contact info to
--    their own pending win and mark it claimed. A plain RLS UPDATE policy
--    would be dangerous here (row-level, not column-level -- a player could
--    rewrite prize_id/won_at on their own row), so this runs as a tightly
--    scoped RPC that only ever touches player_name/player_contact/status,
--    after verifying ownership and that the win is still 'pending'.
--------------------------------------------------------------------------------

create or replace function public.check_quiz_answer(
  p_question_id uuid,
  p_submitted_answer text
)
returns table (
  is_correct boolean,
  correct_answer text,
  question_type text,
  explanation text,
  points integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_correct_answer text;
  v_question_type text;
  v_explanation text;
  v_points integer;
  v_is_correct boolean;
begin
  select gq.correct_answer, gq.question_type, gq.explanation, gq.points
    into v_correct_answer, v_question_type, v_explanation, v_points
  from public.game_questions gq
  where gq.id = p_question_id;

  if v_correct_answer is null then
    raise exception 'Question not found';
  end if;

  if v_question_type = 'text' then
    -- Free-typed answers: forgiving comparison (trim + case-insensitive).
    v_is_correct := lower(trim(coalesce(p_submitted_answer, ''))) = lower(trim(v_correct_answer));
  else
    -- multiple_choice: submitted value is the chosen option's generated id.
    -- true_false: submitted value is the literal 'true'/'false' string.
    -- Both are exact, system-generated tokens -- no normalization wanted.
    v_is_correct := coalesce(p_submitted_answer, '') = v_correct_answer;
  end if;

  return query
    select v_is_correct, v_correct_answer, v_question_type, v_explanation, v_points;
end;
$$;

grant execute on function public.check_quiz_answer(uuid, text) to anon, authenticated;

comment on function public.check_quiz_answer is
  'Server-side answer check for the player Quiz challenge. Never exposes correct_answer to the client until after a submission has already been made.';

create or replace function public.claim_prize_win(
  p_winner_record_id uuid,
  p_player_name text,
  p_player_contact text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_status public.winner_records.status%type;
begin
  if trim(coalesce(p_player_name, '')) = '' then
    raise exception 'Name is required';
  end if;

  if trim(coalesce(p_player_contact, '')) = '' then
    raise exception 'Contact info is required';
  end if;

  select gs.player_id, wr.status
    into v_owner_id, v_status
  from public.winner_records wr
  join public.game_sessions gs on gs.id = wr.game_session_id
  where wr.id = p_winner_record_id
  for update of wr;

  if v_owner_id is null then
    raise exception 'Winner record not found';
  end if;

  if v_owner_id <> auth.uid() then
    raise exception 'Not authorized to claim this prize';
  end if;

  if v_status <> 'pending' then
    raise exception 'This prize is no longer claimable';
  end if;

  update public.winner_records
  set player_name = p_player_name,
      player_contact = p_player_contact,
      status = 'claimed'
  where id = p_winner_record_id;
end;
$$;

grant execute on function public.claim_prize_win(uuid, text, text) to anon, authenticated;

comment on function public.claim_prize_win is
  'Lets a player attach contact info to their own pending win and mark it claimed. Scoped to exactly those columns -- deliberately not a general-purpose UPDATE policy.';
