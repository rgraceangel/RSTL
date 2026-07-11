-- Atomically swaps a question's order_index with its immediate neighbor
-- (up or down) within the same game. Done as a 3-step swap through a
-- sentinel value (-1) because game_questions_order_unique is a plain
-- (non-deferrable) unique constraint on (game_id, order_index): two
-- sequential UPDATEs that directly traded values would violate it the
-- moment the first UPDATE lands on the second row's current value.
-- SECURITY DEFINER + an explicit is_admin() check keeps this admin-only
-- even though it has to bypass the caller's own UPDATE grants to run.
create or replace function public.move_game_question(
  p_question_id uuid,
  p_direction text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_game_id uuid;
  v_current_order integer;
  v_target_id uuid;
  v_target_order integer;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if p_direction not in ('up', 'down') then
    raise exception 'Invalid direction: %', p_direction;
  end if;

  select game_id, order_index into v_game_id, v_current_order
  from public.game_questions
  where id = p_question_id;

  if v_game_id is null then
    raise exception 'Question not found';
  end if;

  if p_direction = 'up' then
    select id, order_index into v_target_id, v_target_order
    from public.game_questions
    where game_id = v_game_id and order_index < v_current_order
    order by order_index desc
    limit 1;
  else
    select id, order_index into v_target_id, v_target_order
    from public.game_questions
    where game_id = v_game_id and order_index > v_current_order
    order by order_index asc
    limit 1;
  end if;

  if v_target_id is null then
    return; -- already at the boundary; no-op rather than an error
  end if;

  update public.game_questions set order_index = -1 where id = p_question_id;
  update public.game_questions set order_index = v_current_order where id = v_target_id;
  update public.game_questions set order_index = v_target_order where id = p_question_id;
end;
$$;

grant execute on function public.move_game_question(uuid, text) to authenticated;

comment on function public.move_game_question(uuid, text) is
  'Swaps a question order_index with its up/down neighbor atomically. Admin-only (checked internally via is_admin()).';
