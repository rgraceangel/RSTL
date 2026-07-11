create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'moderator')),
  avatar_url text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admins_user_id on public.admins (user_id);
create index if not exists idx_admins_role on public.admins (role);
create index if not exists idx_admins_is_active on public.admins (is_active);

create trigger trg_admins_updated_at
  before update on public.admins
  for each row
  execute function public.set_updated_at();

comment on table public.admins is
  'Back-office users who can manage games, prizes and content. Linked 1:1 with auth.users.';
