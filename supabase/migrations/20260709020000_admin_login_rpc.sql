-- Lets a signed-in admin stamp their own last_login_at without needing a
-- broader UPDATE grant on public.admins (which is otherwise super_admin-only).
create or replace function public.record_admin_login()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.admins
  set last_login_at = now()
  where user_id = auth.uid();
end;
$$;

grant execute on function public.record_admin_login() to authenticated;

comment on function public.record_admin_login() is
  'Called right after a successful admin sign-in to stamp admins.last_login_at for the current user.';
