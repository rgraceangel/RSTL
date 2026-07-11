create table if not exists public.game_questions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  question_text text not null,
  question_type text not null default 'multiple_choice' check (question_type in ('multiple_choice', 'true_false', 'text')),
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  points integer not null default 10 check (points >= 0),
  order_index integer not null default 0,
  time_limit_seconds integer not null default 30 check (time_limit_seconds > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint game_questions_order_unique unique (game_id, order_index)
);

create index if not exists idx_game_questions_game_id on public.game_questions (game_id);

create trigger trg_game_questions_updated_at
  before update on public.game_questions
  for each row
  execute function public.set_updated_at();

comment on table public.game_questions is
  'Questions belonging to quiz-type games. correct_answer must never be exposed to anonymous clients directly -- use the game_questions_public view.';
