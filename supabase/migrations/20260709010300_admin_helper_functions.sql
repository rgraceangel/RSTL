-- True if the current request is authenticated as an active admin (any role).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and is_active = true
  );
$$;

-- True if the current request is authenticated as an active super_admin.
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid() and role = 'super_admin' and is_active = true
  );
$$;

-- The admins.id row for the current auth.uid(), or null if not an admin.
create or replace function public.current_admin_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.admins where user_id = auth.uid();
$$;
