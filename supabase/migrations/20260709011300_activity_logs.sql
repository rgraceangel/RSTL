create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admins (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_admin_id on public.activity_logs (admin_id);
create index if not exists idx_activity_logs_entity on public.activity_logs (entity_type, entity_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs (created_at);

comment on table public.activity_logs is
  'Immutable audit trail. Rows are written automatically by the log_activity() trigger on sensitive tables.';

--------------------------------------------------------------------------------
-- Generic activity-logging trigger, attached to sensitive tables below.
--------------------------------------------------------------------------------
create or replace function public.log_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
begin
  select id into v_admin_id from public.admins where user_id = auth.uid();

  insert into public.activity_logs (admin_id, action, entity_type, entity_id, details)
  values (
    v_admin_id,
    lower(TG_OP) || '_' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    coalesce(new.id, old.id),
    case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end
  );

  return coalesce(new, old);
end;
$$;

create trigger trg_log_games
  after insert or update or delete on public.games
  for each row execute function public.log_activity();

create trigger trg_log_game_questions
  after insert or update or delete on public.game_questions
  for each row execute function public.log_activity();

create trigger trg_log_prizes
  after insert or update or delete on public.prizes
  for each row execute function public.log_activity();

create trigger trg_log_prize_inventory
  after insert or update or delete on public.prize_inventory
  for each row execute function public.log_activity();

create trigger trg_log_winner_records
  after insert or update or delete on public.winner_records
  for each row execute function public.log_activity();

create trigger trg_log_settings
  after insert or update or delete on public.settings
  for each row execute function public.log_activity();
