insert into public.settings (key, value, description, is_public)
values
  ('site_maintenance_mode', 'false'::jsonb, 'When true, the public game client shows a maintenance screen instead of games.', true),
  ('max_daily_plays_per_player', '5'::jsonb, 'Global default cap on plays per player per day, unless overridden per game.', false),
  ('support_contact_email', '"support@example.com"'::jsonb, 'Support email shown to players.', true)
on conflict (key) do nothing;
