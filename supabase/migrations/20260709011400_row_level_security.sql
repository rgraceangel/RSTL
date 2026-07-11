-- Enable RLS on every table. With RLS enabled and no matching policy for a
-- given command, access is denied by default (fail closed).
alter table public.admins           enable row level security;
alter table public.games            enable row level security;
alter table public.game_questions   enable row level security;
alter table public.game_images      enable row level security;
alter table public.prizes           enable row level security;
alter table public.prize_inventory  enable row level security;
alter table public.game_sessions    enable row level security;
alter table public.winner_records   enable row level security;
alter table public.analytics        enable row level security;
alter table public.activity_logs    enable row level security;
alter table public.settings         enable row level security;

--------------------------------------------------------------------------------
-- admins
-- NOTE: bootstrap the first super_admin using the service_role key (which
-- bypasses RLS entirely) -- e.g. from the SQL editor or a one-off setup script.
--------------------------------------------------------------------------------
create policy "Admins view own record, super admins view all"
  on public.admins for select
  using (auth.uid() = user_id or public.is_super_admin());

create policy "Super admins create admins"
  on public.admins for insert
  with check (public.is_super_admin());

create policy "Super admins update admins"
  on public.admins for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

create policy "Super admins delete admins"
  on public.admins for delete
  using (public.is_super_admin());

--------------------------------------------------------------------------------
-- games
--------------------------------------------------------------------------------
create policy "Public can view active games"
  on public.games for select
  using (status = 'active' or public.is_admin());

create policy "Admins insert games"
  on public.games for insert
  with check (public.is_admin());

create policy "Admins update games"
  on public.games for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete games"
  on public.games for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- game_questions (base table stays admin-only -- correct_answer is sensitive;
-- public clients should read from the game_questions_public view instead)
--------------------------------------------------------------------------------
create policy "Admins view questions"
  on public.game_questions for select
  using (public.is_admin());

create policy "Admins insert questions"
  on public.game_questions for insert
  with check (public.is_admin());

create policy "Admins update questions"
  on public.game_questions for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete questions"
  on public.game_questions for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- game_images
--------------------------------------------------------------------------------
create policy "Public can view images for active games"
  on public.game_images for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.games g
      where g.id = game_images.game_id and g.status = 'active'
    )
  );

create policy "Admins insert images"
  on public.game_images for insert
  with check (public.is_admin());

create policy "Admins update images"
  on public.game_images for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete images"
  on public.game_images for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- prizes
--------------------------------------------------------------------------------
create policy "Public can view active prizes"
  on public.prizes for select
  using (is_active = true or public.is_admin());

create policy "Admins insert prizes"
  on public.prizes for insert
  with check (public.is_admin());

create policy "Admins update prizes"
  on public.prizes for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete prizes"
  on public.prizes for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- prize_inventory (admin-only; the deduction/restock triggers are SECURITY
-- DEFINER so they bypass these restrictions regardless of who inserts a win)
--------------------------------------------------------------------------------
create policy "Admins view inventory"
  on public.prize_inventory for select
  using (public.is_admin());

create policy "Admins insert inventory"
  on public.prize_inventory for insert
  with check (public.is_admin());

create policy "Admins update inventory"
  on public.prize_inventory for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete inventory"
  on public.prize_inventory for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- game_sessions (players own their session via Supabase auth, anonymous
-- sign-in included; admins can see/manage everything)
--------------------------------------------------------------------------------
create policy "Players view own sessions"
  on public.game_sessions for select
  using (player_id = auth.uid() or public.is_admin());

create policy "Players create own sessions"
  on public.game_sessions for insert
  with check (player_id = auth.uid());

create policy "Players update own in-progress sessions"
  on public.game_sessions for update
  using (player_id = auth.uid() and status = 'in_progress')
  with check (player_id = auth.uid());

create policy "Admins update any session"
  on public.game_sessions for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete sessions"
  on public.game_sessions for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- winner_records (a player may record a win only for their own completed
-- session; the BEFORE INSERT inventory trigger still enforces stock limits)
--------------------------------------------------------------------------------
create policy "Players view own wins"
  on public.winner_records for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.game_sessions gs
      where gs.id = winner_records.game_session_id and gs.player_id = auth.uid()
    )
  );

create policy "Players record own win"
  on public.winner_records for insert
  with check (
    exists (
      select 1 from public.game_sessions gs
      where gs.id = winner_records.game_session_id
        and gs.player_id = auth.uid()
        and gs.status = 'completed'
    )
  );

create policy "Admins update winner records"
  on public.winner_records for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete winner records"
  on public.winner_records for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- analytics (admin/service-role only; dashboards and cron jobs read/write this)
--------------------------------------------------------------------------------
create policy "Admins view analytics"
  on public.analytics for select
  using (public.is_admin());

create policy "Admins insert analytics"
  on public.analytics for insert
  with check (public.is_admin());

create policy "Admins update analytics"
  on public.analytics for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete analytics"
  on public.analytics for delete
  using (public.is_admin());

--------------------------------------------------------------------------------
-- activity_logs (immutable: no update/delete policy exists for anyone, so
-- both are denied outright once RLS is enabled)
--------------------------------------------------------------------------------
create policy "Admins view activity logs"
  on public.activity_logs for select
  using (public.is_admin());

create policy "Admins insert activity logs"
  on public.activity_logs for insert
  with check (public.is_admin());

--------------------------------------------------------------------------------
-- settings
--------------------------------------------------------------------------------
create policy "Public can view public settings"
  on public.settings for select
  using (is_public = true or public.is_admin());

create policy "Admins insert settings"
  on public.settings for insert
  with check (public.is_admin());

create policy "Admins update settings"
  on public.settings for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins delete settings"
  on public.settings for delete
  using (public.is_admin());
