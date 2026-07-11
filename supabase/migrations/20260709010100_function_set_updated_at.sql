-- Generic trigger function: keeps `updated_at` current on every row update.
-- Attach with: `before update ... for each row execute function public.set_updated_at();`
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger function: sets updated_at = now() on any row update.';
