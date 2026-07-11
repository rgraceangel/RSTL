create table if not exists public.game_images (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  question_id uuid references public.game_questions (id) on delete cascade,
  image_url text not null,
  image_type text not null default 'banner' check (image_type in ('banner', 'thumbnail', 'question', 'background', 'icon')),
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_game_images_game_id on public.game_images (game_id);
create index if not exists idx_game_images_question_id on public.game_images (question_id);
create index if not exists idx_game_images_type on public.game_images (image_type);

create trigger trg_game_images_updated_at
  before update on public.game_images
  for each row
  execute function public.set_updated_at();

comment on table public.game_images is
  'Images attached to a game (banner/thumbnail/background) or to a specific question.';
