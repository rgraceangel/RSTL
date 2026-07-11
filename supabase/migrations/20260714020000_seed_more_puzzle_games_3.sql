--------------------------------------------------------------------------------
-- Section 16f seed content: Emoji Science, Picture Puzzle, Memory Challenge,
-- Spot the Difference, PPE Challenge.
--
-- All REAL, directly-authored content. Picture Puzzle/Memory Challenge/Spot the
-- Difference/PPE Challenge images are original, simple line-drawings generated
-- from a shared icon library (scripts/icon_lib.py) -- not photos or third-party
-- art -- watermarked 'SAMPLE IMAGE', same replace-via-admin policy as every
-- other sample image in this project.
--------------------------------------------------------------------------------

insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)
values
  ('ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Emoji Science', 'emoji-science', null, 'emoji_science', 'active', 3),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Picture Puzzle', 'picture-puzzle', null, 'picture_puzzle', 'active', 3),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Memory Challenge', 'memory-challenge', null, 'memory_challenge', 'active', 3),
    ('91083955-c310-420b-92cd-aff190d29b18', 'Spot the Difference', 'spot-the-difference', null, 'spot_the_difference', 'active', 3),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'PPE Challenge', 'ppe-challenge', null, 'ppe_challenge', 'active', 3)
on conflict (slug) do nothing;


-- Emoji Science: 20 rounds (real science concepts decoded from emoji sequences).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('ac6a6330-cb30-4fa9-9f9b-b8beccb7acdc', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which phenomenon do these emoji represent? ⚡ + 🌩️', 'text', 'Lightning', 10, 1, 25, null),
    ('c176521a-a152-4198-8056-739f4c32eb16', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which process do these emoji represent? 🐛 + 🦋', 'text', 'Metamorphosis', 10, 2, 25, null),
    ('46838126-aad4-4c65-96e4-03c22f25e780', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which force do these emoji represent? 🍎 + ⬇️', 'text', 'Gravity', 10, 3, 25, null),
    ('ce5716c0-489f-4e90-8914-6919816d42c3', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which process do these emoji represent? ☀️ + 🌱', 'text', 'Photosynthesis', 10, 4, 25, null),
    ('fd3d534f-648c-4084-9859-b4e24a6e4515', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which state change do these emoji represent? 🧊 + 🔥', 'text', 'Melting', 10, 5, 25, null),
    ('f27a1726-e568-4c7d-aecd-9bbf9aa5f6dc', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which state change do these emoji represent? 💧 + ❄️', 'text', 'Freezing', 10, 6, 25, null),
    ('8ee9d6b0-d724-4907-a89b-73054901e463', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which state change do these emoji represent? 💧 + 🔥', 'text', 'Evaporation', 10, 7, 25, null),
    ('13d40c8d-2b18-4eb3-a319-09ff12a330ac', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which state change do these emoji represent? 💨 + ❄️', 'text', 'Condensation', 10, 8, 25, null),
    ('6b9719fa-de27-4f69-a356-5577660f2b9b', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which molecule do these emoji represent? 🧬', 'text', 'DNA', 10, 9, 25, null),
    ('1dc7d7d7-bf61-4a65-8ac8-c2574e729611', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which body system do these emoji represent? 🩸 + ❤️', 'text', 'Circulatory System', 10, 10, 25, null),
    ('29e4eb66-31a5-4501-b434-766c9e96205c', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which sense do these emoji represent? 👁️ + 🌈', 'text', 'Sight', 10, 11, 25, null),
    ('8d8fb13a-b51c-47e9-8e65-d954e41fb6b6', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which sense do these emoji represent? 👂 + 🔊', 'text', 'Hearing', 10, 12, 25, null),
    ('285c51c3-f707-43ab-84cb-fdb5be8e6f2e', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which quantity do these emoji represent? 🌡️ + 🔥', 'text', 'Temperature', 10, 13, 25, null),
    ('97e1a800-4278-4874-9885-f6ef496f4b82', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which force do these emoji represent? 🧲 + 🔩', 'text', 'Magnetism', 10, 14, 25, null),
    ('9a7dc7e2-19a3-4e20-833e-66db5958e7a1', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which phenomenon do these emoji represent? 🌊 + 🌙', 'text', 'Tides', 10, 15, 25, null),
    ('b88d2b8a-ec38-449a-9223-c448009c0167', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which natural event do these emoji represent? 🌋 + 🔥', 'text', 'Volcanic Eruption', 10, 16, 25, null),
    ('24c63346-6b6e-4b11-99d5-53c0d7c557ed', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which body system do these emoji represent? 🦴 + 🩻', 'text', 'Skeletal System', 10, 17, 25, null),
    ('b4e0c72f-1539-4d35-a4e4-ab027b07cd31', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which process do these emoji represent? 🥚 + 🐣', 'text', 'Hatching', 10, 18, 25, null),
    ('5396ad47-9674-4a9b-90de-3381610e8d83', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which energy source do these emoji represent? ☀️ + 🔋', 'text', 'Solar Energy', 10, 19, 25, null),
    ('bf9b6377-70ce-493b-a5fc-cef4c9b1f70d', 'ea9a4ec7-cc56-478f-afb7-c3c33f831a93', 'Which phenomenon do these emoji represent? ☔ + ☀️', 'text', 'Rainbow', 10, 20, 25, null);

-- Picture Puzzle: 10 rounds (two pictured word-parts combine into a compound science term).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('4e382070-a1f8-43eb-965d-288487fa83dd', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Watershed', 10, 1, 25, null),
    ('1bff0a7f-668b-437d-9570-7f72faa3bed6', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Sunlight', 10, 2, 25, null),
    ('809347a3-b6d5-4b8f-b31a-a90715b70d66', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Earthquake', 10, 3, 25, null),
    ('6f472473-024c-4362-8b25-4041f15d430e', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Rainfall', 10, 4, 25, null),
    ('20ecfa50-aeaf-4cd9-aee5-bfd68cd0da96', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Microscope', 10, 5, 25, null),
    ('836b52b9-390f-4042-bb17-f3a59c73b077', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Thermometer', 10, 6, 25, null),
    ('eea11a54-c80c-46e2-a561-a6e8bde4d9c6', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Ecosystem', 10, 7, 25, null),
    ('a3f5f599-7868-46f2-b48a-c580f5a3ef56', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Biosphere', 10, 8, 25, null),
    ('4bfc879b-5fa7-4d99-aa0e-fa63e1b27b08', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Hydropower', 10, 9, 25, null),
    ('6ee5267d-1e2d-41f2-a2c2-5e1848299f57', '70063124-4013-4ad0-b5bd-6c781b0dddfb', 'Combine these two pictures to form a single science term. What is it?', 'text', 'Geothermal', 10, 10, 25, null);

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '4e382070-a1f8-43eb-965d-288487fa83dd', '/game-assets/picture-puzzle/watershed.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '1bff0a7f-668b-437d-9570-7f72faa3bed6', '/game-assets/picture-puzzle/sunlight.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '809347a3-b6d5-4b8f-b31a-a90715b70d66', '/game-assets/picture-puzzle/earthquake.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '6f472473-024c-4362-8b25-4041f15d430e', '/game-assets/picture-puzzle/rainfall.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '20ecfa50-aeaf-4cd9-aee5-bfd68cd0da96', '/game-assets/picture-puzzle/microscope.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '836b52b9-390f-4042-bb17-f3a59c73b077', '/game-assets/picture-puzzle/thermometer-puzzle.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', 'eea11a54-c80c-46e2-a561-a6e8bde4d9c6', '/game-assets/picture-puzzle/ecosystem.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', 'a3f5f599-7868-46f2-b48a-c580f5a3ef56', '/game-assets/picture-puzzle/biosphere.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '4bfc879b-5fa7-4d99-aa0e-fa63e1b27b08', '/game-assets/picture-puzzle/hydropower.png', 'question'),
    ('70063124-4013-4ad0-b5bd-6c781b0dddfb', '6ee5267d-1e2d-41f2-a2c2-5e1848299f57', '/game-assets/picture-puzzle/geothermal.png', 'question');

-- Memory Challenge: 12 rounds (glance at 4 pictured items, recall which one was NOT shown).
insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('acf1101d-1c8f-412f-9205-fae9f6b6fbb3', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "a", "text": "Test Tube"}, {"id": "b", "text": "Beaker"}, {"id": "d", "text": "Thermometer"}, {"id": "e", "text": "Magnet"}, {"id": "c", "text": "Flask"}]'::jsonb, 'a', 10, 1, 20, null),
    ('7222298a-b15b-47c3-8d81-9935b524321b', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "a", "text": "Sun"}, {"id": "d", "text": "Gear"}, {"id": "e", "text": "Leaf"}, {"id": "c", "text": "Petri Dish"}, {"id": "b", "text": "Test Tube"}]'::jsonb, 'a', 10, 2, 20, null),
    ('fff12f51-6468-43fe-9842-461acafa9bcd', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "b", "text": "Water Droplet"}, {"id": "c", "text": "Flame"}, {"id": "d", "text": "Light Bulb"}, {"id": "a", "text": "Gear"}, {"id": "e", "text": "Ruler"}]'::jsonb, 'a', 10, 3, 20, null),
    ('87af4c0c-7e53-4227-9aef-b5533e1a0bc5', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "c", "text": "Rain Cloud"}, {"id": "e", "text": "Moon"}, {"id": "a", "text": "Star"}, {"id": "b", "text": "Magnifying Glass"}, {"id": "d", "text": "Sun"}]'::jsonb, 'a', 10, 4, 20, null),
    ('d055df52-a03c-4b04-9afd-9e9e17ce72b5', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "a", "text": "Water Droplet"}, {"id": "d", "text": "Clock"}, {"id": "e", "text": "Balance Scale"}, {"id": "b", "text": "Star"}, {"id": "c", "text": "Battery"}]'::jsonb, 'a', 10, 5, 20, null),
    ('a70bd342-bf84-48da-b9b6-4d414f847725', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "a", "text": "Petri Dish"}, {"id": "e", "text": "Magnet"}, {"id": "c", "text": "Test Tube"}, {"id": "b", "text": "Beaker"}, {"id": "d", "text": "Flame"}]'::jsonb, 'a', 10, 6, 20, null),
    ('cce90ccb-8e57-4a3f-9f50-fca5b6074d23', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "d", "text": "Thermometer"}, {"id": "b", "text": "Flask"}, {"id": "c", "text": "Petri Dish"}, {"id": "e", "text": "Leaf"}, {"id": "a", "text": "Magnet"}]'::jsonb, 'a', 10, 7, 20, null),
    ('85f29aff-89d2-4d25-8369-23144ab02e88', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "a", "text": "Ruler"}, {"id": "b", "text": "Water Droplet"}, {"id": "d", "text": "Light Bulb"}, {"id": "e", "text": "Star"}, {"id": "c", "text": "Gear"}]'::jsonb, 'a', 10, 8, 20, null),
    ('ea01e826-2e51-45f3-b66e-a0428fb48438', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "d", "text": "Clock"}, {"id": "b", "text": "Sun"}, {"id": "e", "text": "Battery"}, {"id": "a", "text": "Rain Cloud"}, {"id": "c", "text": "Moon"}]'::jsonb, 'a', 10, 9, 20, null),
    ('fa3ac389-211d-45a2-9ac9-027a4a9c6d24', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "c", "text": "Ruler"}, {"id": "e", "text": "Flame"}, {"id": "b", "text": "Magnifying Glass"}, {"id": "a", "text": "Light Bulb"}, {"id": "d", "text": "Balance Scale"}]'::jsonb, 'a', 10, 10, 20, null),
    ('5327adfe-df57-475a-9a38-6e1d4cd54170', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "c", "text": "Flask"}, {"id": "d", "text": "Petri Dish"}, {"id": "e", "text": "Test Tube"}, {"id": "b", "text": "Beaker"}, {"id": "a", "text": "Thermometer"}]'::jsonb, 'a', 10, 11, 20, null),
    ('2f3a21d5-76ce-43c0-b96e-d977d4d4328f', '0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'Look carefully at the image. Which of these items was NOT shown?', 'multiple_choice', '[{"id": "b", "text": "Gear"}, {"id": "c", "text": "Magnet"}, {"id": "e", "text": "Leaf"}, {"id": "a", "text": "Flame"}, {"id": "d", "text": "Water Droplet"}]'::jsonb, 'a', 10, 12, 20, null);

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'acf1101d-1c8f-412f-9205-fae9f6b6fbb3', '/game-assets/memory-challenge/row-1.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', '7222298a-b15b-47c3-8d81-9935b524321b', '/game-assets/memory-challenge/row-2.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'fff12f51-6468-43fe-9842-461acafa9bcd', '/game-assets/memory-challenge/row-3.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', '87af4c0c-7e53-4227-9aef-b5533e1a0bc5', '/game-assets/memory-challenge/row-4.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'd055df52-a03c-4b04-9afd-9e9e17ce72b5', '/game-assets/memory-challenge/row-5.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'a70bd342-bf84-48da-b9b6-4d414f847725', '/game-assets/memory-challenge/row-6.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'cce90ccb-8e57-4a3f-9f50-fca5b6074d23', '/game-assets/memory-challenge/row-7.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', '85f29aff-89d2-4d25-8369-23144ab02e88', '/game-assets/memory-challenge/row-8.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'ea01e826-2e51-45f3-b66e-a0428fb48438', '/game-assets/memory-challenge/row-9.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', 'fa3ac389-211d-45a2-9ac9-027a4a9c6d24', '/game-assets/memory-challenge/row-10.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', '5327adfe-df57-475a-9a38-6e1d4cd54170', '/game-assets/memory-challenge/row-11.png', 'question'),
    ('0e17133f-c6c3-4e3c-a6cd-7328bab16d1c', '2f3a21d5-76ce-43c0-b96e-d977d4d4328f', '/game-assets/memory-challenge/row-12.png', 'question');

-- Spot the Difference: 10 rounds (compare two panels, identify the true difference).
insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('91a80fa1-0642-4313-b382-0195dfbac349', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "b", "text": "There is one beaker missing in Image B"}, {"id": "a", "text": "There is one extra beaker in Image B"}, {"id": "c", "text": "The beakers in Image B are a different size"}, {"id": "d", "text": "The beakers in Image B are arranged in a different pattern"}]'::jsonb, 'a', 10, 1, 20, null),
    ('f92e9f25-942d-4ec6-addd-4e2e6f8524dd', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "b", "text": "There is one extra flask in Image B"}, {"id": "a", "text": "There is one flask missing in Image B"}, {"id": "c", "text": "The flasks in Image B are a different size"}, {"id": "d", "text": "The flasks in Image B are arranged in a different pattern"}]'::jsonb, 'a', 10, 2, 20, null),
    ('c2b8fe0a-c654-433c-b166-72dd62242982', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "d", "text": "The test tubes in Image B are arranged in a different pattern"}, {"id": "a", "text": "There is one extra test tube in Image B"}, {"id": "b", "text": "There is one test tube missing in Image B"}, {"id": "c", "text": "The test tubes in Image B are a different size"}]'::jsonb, 'a', 10, 3, 20, null),
    ('4777ea29-6420-4b24-913d-88675e5406b6', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "d", "text": "The gloves in Image B are arranged in a different pattern"}, {"id": "b", "text": "There is one extra pair of gloves in Image B"}, {"id": "a", "text": "There is one pair of gloves missing in Image B"}, {"id": "c", "text": "The gloves in Image B are a different size"}]'::jsonb, 'a', 10, 4, 20, null),
    ('d59aa10d-2339-474b-911c-c89ebc6496db', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "a", "text": "There is one extra pair of goggles in Image B"}, {"id": "b", "text": "There is one pair of goggles missing in Image B"}, {"id": "d", "text": "The goggles in Image B are arranged in a different pattern"}, {"id": "c", "text": "The goggles in Image B are a different size"}]'::jsonb, 'a', 10, 5, 20, null),
    ('ac67c51b-4752-4e95-a663-48eaf2eb8718', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "c", "text": "The magnets in Image B are a different size"}, {"id": "d", "text": "The magnets in Image B are arranged in a different pattern"}, {"id": "b", "text": "There is one extra magnet in Image B"}, {"id": "a", "text": "There is one magnet missing in Image B"}]'::jsonb, 'a', 10, 6, 20, null),
    ('fd25725e-90a5-4c98-822d-5156539d1420', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "a", "text": "There is one extra petri dish in Image B"}, {"id": "d", "text": "The petri dishes in Image B are arranged in a different pattern"}, {"id": "c", "text": "The petri dishes in Image B are a different size"}, {"id": "b", "text": "There is one petri dish missing in Image B"}]'::jsonb, 'a', 10, 7, 20, null),
    ('5757b906-5168-4609-b145-e1c0a1c486b2', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "d", "text": "The beakers in Image B are arranged in a different pattern"}, {"id": "b", "text": "There is one extra beaker in Image B"}, {"id": "a", "text": "There is one beaker missing in Image B"}, {"id": "c", "text": "The beakers in Image B are a different size"}]'::jsonb, 'a', 10, 8, 20, null),
    ('acb1cbdb-132f-4bcb-9d2c-b1b53b0c2588', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "a", "text": "There is one extra flask in Image B"}, {"id": "c", "text": "The flasks in Image B are a different size"}, {"id": "d", "text": "The flasks in Image B are arranged in a different pattern"}, {"id": "b", "text": "There is one flask missing in Image B"}]'::jsonb, 'a', 10, 9, 20, null),
    ('f03e90da-c720-45da-8ffd-7da5fae342fb', '91083955-c310-420b-92cd-aff190d29b18', 'Compare Image A and Image B. What is different between them?', 'multiple_choice', '[{"id": "d", "text": "The gloves in Image B are arranged in a different pattern"}, {"id": "b", "text": "There is one extra pair of gloves in Image B"}, {"id": "a", "text": "There is one pair of gloves missing in Image B"}, {"id": "c", "text": "The gloves in Image B are a different size"}]'::jsonb, 'a', 10, 10, 20, null);

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('91083955-c310-420b-92cd-aff190d29b18', '91a80fa1-0642-4313-b382-0195dfbac349', '/game-assets/spot-the-difference/round-1.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'f92e9f25-942d-4ec6-addd-4e2e6f8524dd', '/game-assets/spot-the-difference/round-2.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'c2b8fe0a-c654-433c-b166-72dd62242982', '/game-assets/spot-the-difference/round-3.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', '4777ea29-6420-4b24-913d-88675e5406b6', '/game-assets/spot-the-difference/round-4.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'd59aa10d-2339-474b-911c-c89ebc6496db', '/game-assets/spot-the-difference/round-5.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'ac67c51b-4752-4e95-a663-48eaf2eb8718', '/game-assets/spot-the-difference/round-6.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'fd25725e-90a5-4c98-822d-5156539d1420', '/game-assets/spot-the-difference/round-7.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', '5757b906-5168-4609-b145-e1c0a1c486b2', '/game-assets/spot-the-difference/round-8.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'acb1cbdb-132f-4bcb-9d2c-b1b53b0c2588', '/game-assets/spot-the-difference/round-9.png', 'question'),
    ('91083955-c310-420b-92cd-aff190d29b18', 'f03e90da-c720-45da-8ffd-7da5fae342fb', '/game-assets/spot-the-difference/round-10.png', 'question');

-- PPE Challenge: 10 rounds (name the personal protective equipment shown).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('a5dc4043-8429-4c14-81a3-7e78804b35a8', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Safety Goggles', 10, 1, 20, null),
    ('355eb55c-ca79-441a-b2ef-e4f4900fe444', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Face Shield', 10, 2, 20, null),
    ('c18defc0-de64-4a61-8f75-30121b3f698e', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Nitrile Gloves', 10, 3, 20, null),
    ('dd654ecc-c9c8-4df0-92c9-da8fe46a38eb', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Lab Coat', 10, 4, 20, null),
    ('d13e70ee-e2ab-4ca1-a99f-c724ff33851c', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Respirator Mask', 10, 5, 20, null),
    ('a39d614b-2c3c-4dc5-a9ad-cf377fcf9647', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Ear Protection', 10, 6, 20, null),
    ('bf5d5d23-50da-4f54-b1fc-1277771d47e6', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Apron', 10, 7, 20, null),
    ('8e191ee1-a351-493c-b8eb-541f04a5b59d', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Safety Helmet', 10, 8, 20, null),
    ('fa362605-b3fa-4edc-898f-17bc6b516879', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Safety Boots', 10, 9, 20, null),
    ('6f922f7f-6823-4a37-b7ae-1961f1d61d2d', 'a3966f02-e567-4e32-8c5a-37df74a96e87', 'What personal protective equipment (PPE) is shown?', 'text', 'Hairnet', 10, 10, 20, null);

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'a5dc4043-8429-4c14-81a3-7e78804b35a8', '/game-assets/ppe-challenge/safety-goggles.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', '355eb55c-ca79-441a-b2ef-e4f4900fe444', '/game-assets/ppe-challenge/face-shield.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'c18defc0-de64-4a61-8f75-30121b3f698e', '/game-assets/ppe-challenge/nitrile-gloves.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'dd654ecc-c9c8-4df0-92c9-da8fe46a38eb', '/game-assets/ppe-challenge/lab-coat.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'd13e70ee-e2ab-4ca1-a99f-c724ff33851c', '/game-assets/ppe-challenge/respirator-mask.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'a39d614b-2c3c-4dc5-a9ad-cf377fcf9647', '/game-assets/ppe-challenge/ear-protection.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'bf5d5d23-50da-4f54-b1fc-1277771d47e6', '/game-assets/ppe-challenge/apron.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', '8e191ee1-a351-493c-b8eb-541f04a5b59d', '/game-assets/ppe-challenge/safety-helmet.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', 'fa362605-b3fa-4edc-898f-17bc6b516879', '/game-assets/ppe-challenge/safety-boots.png', 'question'),
    ('a3966f02-e567-4e32-8c5a-37df74a96e87', '6f922f7f-6823-4a37-b7ae-1961f1d61d2d', '/game-assets/ppe-challenge/hairnet.png', 'question');
