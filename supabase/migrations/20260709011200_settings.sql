create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  is_public boolean not null default false,
  updated_by uuid references public.admins (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_settings_key on public.settings (key);
create index if not exists idx_settings_is_public on public.settings (is_public);

create trigger trg_settings_updated_at
  before update on public.settings
  for each row
  execute function public.set_updated_at();

comment on table public.settings is
  'Key/value application configuration. Rows with is_public = true are readable by anonymous clients.';
