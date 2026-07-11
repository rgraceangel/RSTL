-- The Phase 2 RLS only let a player insert a winner_records row for their
-- own completed session. Winners Management (Phase 6) needs admins to be
-- able to record a win manually too (e.g. correcting a missed record, or an
-- offline/promotional award tied to an existing game_session). This adds a
-- second, independent INSERT policy -- Postgres ORs permissive policies
-- together, so either condition being true allows the insert. The
-- BEFORE INSERT inventory trigger (handle_prize_win) still applies
-- regardless of which policy let the row through.
create policy "Admins insert winner records"
  on public.winner_records for insert
  with check (public.is_admin());
