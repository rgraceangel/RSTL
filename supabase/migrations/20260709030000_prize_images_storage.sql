-- Public bucket for prize images. Public read (anyone with the URL can view
-- the image, standard for a public bucket); writes are admin-only.
insert into storage.buckets (id, name, public)
values ('prize-images', 'prize-images', true)
on conflict (id) do nothing;

create policy "Public can view prize images"
  on storage.objects for select
  using (bucket_id = 'prize-images');

create policy "Admins upload prize images"
  on storage.objects for insert
  with check (bucket_id = 'prize-images' and public.is_admin());

create policy "Admins update prize images"
  on storage.objects for update
  using (bucket_id = 'prize-images' and public.is_admin())
  with check (bucket_id = 'prize-images' and public.is_admin());

create policy "Admins delete prize images"
  on storage.objects for delete
  using (bucket_id = 'prize-images' and public.is_admin());
