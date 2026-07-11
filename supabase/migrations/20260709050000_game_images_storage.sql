-- Public bucket for game/question images (banners, thumbnails, question
-- illustrations). Mirrors the prize-images bucket exactly: public read,
-- admin-only write via storage.objects RLS.
insert into storage.buckets (id, name, public)
values ('game-images', 'game-images', true)
on conflict (id) do nothing;

create policy "Public can view game images"
  on storage.objects for select
  using (bucket_id = 'game-images');

create policy "Admins upload game images"
  on storage.objects for insert
  with check (bucket_id = 'game-images' and public.is_admin());

create policy "Admins update game images"
  on storage.objects for update
  using (bucket_id = 'game-images' and public.is_admin())
  with check (bucket_id = 'game-images' and public.is_admin());

create policy "Admins delete game images"
  on storage.objects for delete
  using (bucket_id = 'game-images' and public.is_admin());
