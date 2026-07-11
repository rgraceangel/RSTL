--------------------------------------------------------------------------------
-- Section 16c seed content: Decoder, Guess the Gibberish, Name It to Win It.
--
-- Decoder (72 rounds) and Guess the Gibberish (80 rounds) are REAL content from
-- the uploaded source decks -- every image/phrase was worked out by hand. A
-- small number are flagged '-- REVIEW (low confidence)' in a trailing comment;
-- everything else shipped at medium-to-high confidence. Please spot-check the
-- flagged rows (and any others you're unsure of) in Admin > Games and correct
-- `correct_answer` directly if needed -- no code changes required.
--
-- Name It to Win It (8 rounds) is intentionally SAMPLE/DEV content per your
-- request: generic placeholder icons (public/game-assets/name-it-to-win-it/,
-- clearly watermarked 'SAMPLE IMAGE') across 8 of the 13 categories, so the
-- game is fully playable end-to-end today. Replace/add images and questions any
-- time via Admin > Games > Name It to Win It > Questions -- nothing here is
-- hardcoded, it's all normal game_questions/game_images rows.
--------------------------------------------------------------------------------

insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)
values
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decoder', 'decoder', null, 'decoder', 'active', 3),
  ('11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Guess the Gibberish', 'guess-the-gibberish', null, 'guess_the_gibberish', 'active', 3),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name It to Win It', 'name-it-to-win-it', null, 'name_it_to_win_it', 'active', 3)
on conflict (slug) do nothing;

-- Decoder: 72 rebus-image rounds.
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('43bf6ac4-6809-4040-9e90-930ac06d0ae2', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'My Life', 10, 1, 25, null),
  ('4ce4cf30-1cf7-4d47-ad24-d96850877bf3', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Forget It', 10, 2, 25, null),
  ('a4d21636-76ab-4ff6-b3b7-afa58973003a', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Try to Understand', 10, 3, 25, null),
  ('e1138d0b-3f29-415d-a377-a422340a5fa5', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Overseas Travel', 10, 4, 25, null),
  ('07f8b5a9-e7bf-41d4-9ed0-3ac96387728c', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Breakfast', 10, 5, 25, null),
  ('f62092ef-cdd1-4fb0-aa66-b7c6e4dc71cb', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Blurred Vision', 10, 6, 25, null),
  ('1220deb9-63c9-46e5-9c5e-8f4f0f3022c6', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Downtown', 10, 7, 25, null),
  ('3dee557c-bc11-4755-a28d-a19959d6b56f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Stepfather', 10, 8, 25, null),
  ('97852c02-95c5-4aff-8d55-82451d5e0022', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Once Upon a Time', 10, 9, 25, null),
  ('a9295790-c61e-43f2-b634-b5ae66e638e6', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Jackpot', 10, 10, 25, null),  -- REVIEW (low confidence)
  ('c061ba99-3ad2-4f03-8776-15e1586c94d0', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', '3D Movie', 10, 11, 25, null),
  ('efab1139-3a3c-4ac2-bc5f-791a23dfcca6', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Top Secret', 10, 12, 25, null),
  ('521cb49a-f023-4475-95c9-83ca9a096893', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Trip Around the World', 10, 13, 25, null),
  ('0ac2c3fd-cdc9-4153-879f-a57d4080155a', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Lemonade', 10, 14, 25, null),
  ('62918690-2d69-4c75-96d4-187301f3f6b3', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Long Legs', 10, 15, 25, null),
  ('f061edcc-cb23-49d9-b6a9-686bf4ab185e', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Double Cross', 10, 16, 25, null),
  ('caf6fc18-1cdf-4a65-aeb2-5e3f72558f82', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Man in the Moon', 10, 17, 25, null),
  ('093e672f-343f-4ffa-a9fd-76b26a9d7781', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Big Bad Wolf', 10, 18, 25, null),
  ('f45c56e1-3072-4e0d-af5f-dfa951520c36', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Thanks a Lot', 10, 19, 25, null),
  ('65c79553-8e50-4f91-abc0-3900b80b1748', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Download', 10, 20, 25, null),
  ('936fc6d1-2d38-4c17-8632-1500a431a5c5', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Oh Deer', 10, 21, 25, null),  -- REVIEW (low confidence)
  ('70c2a6c2-5592-4277-9e8b-5c4a5ee01fc2', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Comfortable', 10, 22, 25, null),
  ('00c5f1ae-a4b0-4537-9048-0d5d06db6167', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Forty Years', 10, 23, 25, null),
  ('5ca15fdd-8cda-4821-ba61-0379e3412667', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Excuse Me', 10, 24, 25, null),
  ('f19b2c4e-f0b8-44a5-860d-4effbb8691f3', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Forehead', 10, 25, 25, null),
  ('43ad2e80-63a7-4b81-956f-e76ac476ce05', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Good', 10, 26, 25, null),
  ('cf8ad35d-d5b8-4d8a-9e93-30ade2d1cd4c', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Waterfall', 10, 27, 25, null),
  ('c1a57b28-87ec-4792-a802-e7777ba16997', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Wake Up', 10, 28, 25, null),
  ('66756672-5279-4619-869a-d3458a5c53d3', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Tuna Fish', 10, 29, 25, null),
  ('03761679-ba56-4cf8-8d28-fa43deadcb53', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Foreign Language', 10, 30, 25, null),
  ('862bf112-3dca-41e2-bf78-cd6184a92e69', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Seahorse', 10, 31, 25, null),
  ('df42b497-3387-4d82-ad99-234e81c8da12', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Middle-Aged', 10, 32, 25, null),
  ('8e264a5d-d1a1-4191-b2a7-d0b7b2583800', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Broken Heart', 10, 33, 25, null),
  ('d75c01a7-d01b-425a-9760-2215d48078fa', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Seven Seas', 10, 34, 25, null),  -- REVIEW (low confidence)
  ('0f86e7ac-d77a-4b04-bc05-b14a1d5a57c2', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Alphabet', 10, 35, 25, null),
  ('3b62fd3e-5e19-4fa8-902a-e585053cb14e', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Teabag', 10, 36, 25, null),
  ('46709c40-cad8-4463-9ff7-65688911ff69', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Four Wheel Drive', 10, 37, 25, null),
  ('20c61264-52a7-49b2-a72c-94c3b67e6044', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Apple Pie', 10, 38, 25, null),
  ('3b0d7bb8-9e87-4497-9106-1f67eadeacf7', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Growing Up', 10, 39, 25, null),  -- REVIEW (low confidence)
  ('6a7d1f63-216a-4f38-9c96-8cb90af8b746', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Robin Hood', 10, 40, 25, null),
  ('b62dad1c-9415-481f-a071-ef3ab888f603', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Design', 10, 41, 25, null),
  ('698a8704-97c4-4da3-b415-ad4f173a5b42', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Engineer', 10, 42, 25, null),
  ('80c00019-09cc-4036-8445-a53b82148522', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Vegetables', 10, 43, 25, null),
  ('d069f7d6-9b16-476a-a445-e26afcdc767e', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'High Noon', 10, 44, 25, null),  -- REVIEW (low confidence)
  ('d835eaa9-12ba-4bb9-a5ae-62aceaeecf4f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Overnight Camping', 10, 45, 25, null),
  ('2d016da5-9a7f-4c79-b121-e9ac1c50d3c8', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Time to Go', 10, 46, 25, null),
  ('82f531dc-6dc9-4f4a-a96f-082a4b90c635', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Spacetime', 10, 47, 25, null),  -- REVIEW (low confidence)
  ('33f36dc1-b688-40ff-ac13-1b6c71900303', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Polite', 10, 48, 25, null),  -- REVIEW (low confidence)
  ('90d8fd67-f102-4e90-8797-84c2bfc8653d', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Gone Fishing', 10, 49, 25, null),
  ('b1e8e48c-6638-4ead-b588-91cb16e6cd1b', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Animal Kingdom', 10, 50, 25, null),  -- REVIEW (low confidence)
  ('14f7b345-9889-4593-8a76-a2a8e0df8e6f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Touchdown', 10, 51, 25, null),
  ('5fd6d646-7e36-4b5a-a1ff-0882487ad16f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Jamb', 10, 52, 25, null),
  ('7bbbe9fc-d235-4aa6-9ea6-94ed114f933f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Stepping Stone', 10, 53, 25, null),
  ('8ecf3d7b-a354-4297-9175-8a8f54e35fcd', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Love at First Sight', 10, 54, 25, null),
  ('fddbee8e-1dd6-4ed1-81e6-8054eb65ddc0', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Spillover', 10, 55, 25, null),
  ('b17402d5-fd9f-4327-b947-72c9d423307c', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Mountain Man', 10, 56, 25, null),
  ('f0c81eba-98dc-49a1-9719-c70c6338b2ce', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Catwalk', 10, 57, 25, null),
  ('71d04af0-a30e-41a9-8b39-335cd3a0b503', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'King of the Woods', 10, 58, 25, null),  -- REVIEW (low confidence)
  ('b705e1ae-6fda-40f5-8123-d78e81d6c8e9', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Sandbox', 10, 59, 25, null),
  ('6cd93dd9-72f2-4cb1-bdeb-ed02c3999c57', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Lovebirds', 10, 60, 25, null),
  ('ec5a288c-770e-4515-ba50-34e3bc7914a1', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Elbow', 10, 61, 25, null),  -- REVIEW (low confidence)
  ('d6e61fe7-c6aa-49af-9dd1-8865cbc39f92', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Easy as 1-2-3', 10, 62, 25, null),
  ('c3289601-ba68-4878-90d0-147e6287b7a4', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Hot Coffee', 10, 63, 25, null),
  ('d0469513-52e8-4e10-918a-82945a190ba1', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Multiple Choice', 10, 64, 25, null),
  ('3075acde-1306-4a9b-b88d-ea94443fa900', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Change of Seasons', 10, 65, 25, null),
  ('0927f8d4-43e3-4897-8d9d-358ee3353695', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Double Agent', 10, 66, 25, null),
  ('72d97c0c-4544-4b48-b424-6ebb673be27f', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Smoke Check', 10, 67, 25, null),  -- REVIEW (low confidence)
  ('20602c0c-e013-449e-af24-424bbb63ee9c', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'I''m Into You', 10, 68, 25, null),  -- REVIEW (low confidence)
  ('84e7edde-a4fe-4571-bbc6-e98287cb3ded', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Illegal', 10, 69, 25, null),
  ('c04c2218-69d4-4593-87bf-273e677a8763', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Double Agent', 10, 70, 25, null),  -- REVIEW (low confidence)
  ('67d16fc5-988c-4a31-bd97-d6ee44781fc4', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Rock N'' Roll', 10, 71, 25, null),
  ('903535d1-a6f7-4c0d-91a0-0c6b05357003', 'c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'Decode the picture!', 'text', 'Good Afternoon', 10, 72, 25, null);

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '43bf6ac4-6809-4040-9e90-930ac06d0ae2', '/game-assets/decoder/01.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '4ce4cf30-1cf7-4d47-ad24-d96850877bf3', '/game-assets/decoder/02.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'a4d21636-76ab-4ff6-b3b7-afa58973003a', '/game-assets/decoder/03.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'e1138d0b-3f29-415d-a377-a422340a5fa5', '/game-assets/decoder/04.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '07f8b5a9-e7bf-41d4-9ed0-3ac96387728c', '/game-assets/decoder/05.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'f62092ef-cdd1-4fb0-aa66-b7c6e4dc71cb', '/game-assets/decoder/06.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '1220deb9-63c9-46e5-9c5e-8f4f0f3022c6', '/game-assets/decoder/07.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '3dee557c-bc11-4755-a28d-a19959d6b56f', '/game-assets/decoder/08.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '97852c02-95c5-4aff-8d55-82451d5e0022', '/game-assets/decoder/09.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'a9295790-c61e-43f2-b634-b5ae66e638e6', '/game-assets/decoder/10.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'c061ba99-3ad2-4f03-8776-15e1586c94d0', '/game-assets/decoder/11.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'efab1139-3a3c-4ac2-bc5f-791a23dfcca6', '/game-assets/decoder/12.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '521cb49a-f023-4475-95c9-83ca9a096893', '/game-assets/decoder/13.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '0ac2c3fd-cdc9-4153-879f-a57d4080155a', '/game-assets/decoder/14.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '62918690-2d69-4c75-96d4-187301f3f6b3', '/game-assets/decoder/15.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'f061edcc-cb23-49d9-b6a9-686bf4ab185e', '/game-assets/decoder/16.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'caf6fc18-1cdf-4a65-aeb2-5e3f72558f82', '/game-assets/decoder/17.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '093e672f-343f-4ffa-a9fd-76b26a9d7781', '/game-assets/decoder/18.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'f45c56e1-3072-4e0d-af5f-dfa951520c36', '/game-assets/decoder/19.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '65c79553-8e50-4f91-abc0-3900b80b1748', '/game-assets/decoder/20.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '936fc6d1-2d38-4c17-8632-1500a431a5c5', '/game-assets/decoder/21.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '70c2a6c2-5592-4277-9e8b-5c4a5ee01fc2', '/game-assets/decoder/22.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '00c5f1ae-a4b0-4537-9048-0d5d06db6167', '/game-assets/decoder/23.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '5ca15fdd-8cda-4821-ba61-0379e3412667', '/game-assets/decoder/24.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'f19b2c4e-f0b8-44a5-860d-4effbb8691f3', '/game-assets/decoder/25.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '43ad2e80-63a7-4b81-956f-e76ac476ce05', '/game-assets/decoder/26.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'cf8ad35d-d5b8-4d8a-9e93-30ade2d1cd4c', '/game-assets/decoder/27.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'c1a57b28-87ec-4792-a802-e7777ba16997', '/game-assets/decoder/28.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '66756672-5279-4619-869a-d3458a5c53d3', '/game-assets/decoder/29.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '03761679-ba56-4cf8-8d28-fa43deadcb53', '/game-assets/decoder/30.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '862bf112-3dca-41e2-bf78-cd6184a92e69', '/game-assets/decoder/31.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'df42b497-3387-4d82-ad99-234e81c8da12', '/game-assets/decoder/32.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '8e264a5d-d1a1-4191-b2a7-d0b7b2583800', '/game-assets/decoder/33.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'd75c01a7-d01b-425a-9760-2215d48078fa', '/game-assets/decoder/34.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '0f86e7ac-d77a-4b04-bc05-b14a1d5a57c2', '/game-assets/decoder/35.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '3b62fd3e-5e19-4fa8-902a-e585053cb14e', '/game-assets/decoder/36.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '46709c40-cad8-4463-9ff7-65688911ff69', '/game-assets/decoder/37.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '20c61264-52a7-49b2-a72c-94c3b67e6044', '/game-assets/decoder/38.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '3b0d7bb8-9e87-4497-9106-1f67eadeacf7', '/game-assets/decoder/39.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '6a7d1f63-216a-4f38-9c96-8cb90af8b746', '/game-assets/decoder/40.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'b62dad1c-9415-481f-a071-ef3ab888f603', '/game-assets/decoder/41.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '698a8704-97c4-4da3-b415-ad4f173a5b42', '/game-assets/decoder/42.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '80c00019-09cc-4036-8445-a53b82148522', '/game-assets/decoder/43.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'd069f7d6-9b16-476a-a445-e26afcdc767e', '/game-assets/decoder/44.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'd835eaa9-12ba-4bb9-a5ae-62aceaeecf4f', '/game-assets/decoder/45.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '2d016da5-9a7f-4c79-b121-e9ac1c50d3c8', '/game-assets/decoder/46.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '82f531dc-6dc9-4f4a-a96f-082a4b90c635', '/game-assets/decoder/47.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '33f36dc1-b688-40ff-ac13-1b6c71900303', '/game-assets/decoder/48.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '90d8fd67-f102-4e90-8797-84c2bfc8653d', '/game-assets/decoder/49.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'b1e8e48c-6638-4ead-b588-91cb16e6cd1b', '/game-assets/decoder/50.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '14f7b345-9889-4593-8a76-a2a8e0df8e6f', '/game-assets/decoder/51.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '5fd6d646-7e36-4b5a-a1ff-0882487ad16f', '/game-assets/decoder/52.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '7bbbe9fc-d235-4aa6-9ea6-94ed114f933f', '/game-assets/decoder/53.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '8ecf3d7b-a354-4297-9175-8a8f54e35fcd', '/game-assets/decoder/54.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'fddbee8e-1dd6-4ed1-81e6-8054eb65ddc0', '/game-assets/decoder/55.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'b17402d5-fd9f-4327-b947-72c9d423307c', '/game-assets/decoder/56.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'f0c81eba-98dc-49a1-9719-c70c6338b2ce', '/game-assets/decoder/57.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '71d04af0-a30e-41a9-8b39-335cd3a0b503', '/game-assets/decoder/58.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'b705e1ae-6fda-40f5-8123-d78e81d6c8e9', '/game-assets/decoder/59.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '6cd93dd9-72f2-4cb1-bdeb-ed02c3999c57', '/game-assets/decoder/60.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'ec5a288c-770e-4515-ba50-34e3bc7914a1', '/game-assets/decoder/61.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'd6e61fe7-c6aa-49af-9dd1-8865cbc39f92', '/game-assets/decoder/62.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'c3289601-ba68-4878-90d0-147e6287b7a4', '/game-assets/decoder/63.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'd0469513-52e8-4e10-918a-82945a190ba1', '/game-assets/decoder/64.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '3075acde-1306-4a9b-b88d-ea94443fa900', '/game-assets/decoder/65.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '0927f8d4-43e3-4897-8d9d-358ee3353695', '/game-assets/decoder/66.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '72d97c0c-4544-4b48-b424-6ebb673be27f', '/game-assets/decoder/67.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '20602c0c-e013-449e-af24-424bbb63ee9c', '/game-assets/decoder/68.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '84e7edde-a4fe-4571-bbc6-e98287cb3ded', '/game-assets/decoder/69.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', 'c04c2218-69d4-4593-87bf-273e677a8763', '/game-assets/decoder/70.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '67d16fc5-988c-4a31-bd97-d6ee44781fc4', '/game-assets/decoder/71.png', 'question'),
  ('c8b5916a-6501-40a3-a6e3-7162055ed7d8', '903535d1-a6f7-4c0d-91a0-0c6b05357003', '/game-assets/decoder/72.png', 'question');

-- Guess the Gibberish: 80 phonetic-phrase rounds.
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('d5a9fc88-082a-4327-90af-98010618f929', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'See Live Bell', 'text', 'Syllable', 10, 1, 20, null),
  ('8ac7a07b-035b-4b09-ae66-df5bee799570', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Them Per Eight Sure', 'text', 'Temperature', 10, 2, 20, null),
  ('84668cc2-8d2b-46cf-996c-331eee89245b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'New Tree Shown', 'text', 'Nutrition', 10, 3, 20, null),
  ('40ee1823-cbef-422d-9626-d863f78ca7b8', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Care Bone Dye Ox Hide', 'text', 'Carbon Dioxide', 10, 4, 20, null),
  ('beb636fd-5a05-4a4f-8ea7-68c2a766a4bb', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Oh Cyan War Men', 'text', 'Ocean Warming', 10, 5, 20, null),
  ('0c8a118c-b197-4417-be28-57408fbbfa82', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Glow Bar Wear Main', 'text', 'Global Warming', 10, 6, 20, null),
  ('967f3f55-6168-45cb-ac5a-868dd04b4bca', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Core War Aunt In', 'text', 'Quarantine', 10, 7, 20, null),
  ('1dfcb588-d53b-4d64-a1ec-7492b10daa52', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Cone Dean Say Shown', 'text', 'Condensation', 10, 8, 20, null),
  ('e5349cfb-265d-40a9-9260-b2ea71e33faa', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Rest Pee Ray Shown', 'text', 'Respiration', 10, 9, 20, null),
  ('b9ef008e-49f3-42c8-a1f3-42b2ee29e2d7', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pho Two Cyan Tea Says', 'text', 'Photosynthesis', 10, 10, 20, null),
  ('7e83faa2-cbe3-452c-8635-b70d39b3b68b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Sauce Ten Neigh Ball Day Veil Lope Mint', 'text', 'Sustainable Development', 10, 11, 20, null),
  ('967c1049-3e50-4422-90ac-b0abe584541b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Tie Tray Shown', 'text', 'Titration', 10, 12, 20, null),
  ('76810445-3fe5-4296-b4a6-e64307d9d0bd', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Call Lee Tea Cone Troll', 'text', 'Quality Control', 10, 13, 20, null),
  ('2016b30d-27ba-4456-a13c-bf9f9a86df50', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'In Awe Vase On', 'text', 'Innovation', 10, 14, 20, null),
  ('6a4ffefb-bbf0-4981-9bf9-a8c8af142e82', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Im Oh Show Null In Sell In Jeans', 'text', 'Insulin Genes', 10, 15, 20, null),  -- REVIEW (low confidence)
  ('b84624fc-0def-4d8a-bd7e-90f8709ac83e', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'They The God There In', 'text', 'Data Governance', 10, 16, 20, null),  -- REVIEW (low confidence)
  ('4323387d-cce7-4e5b-9a1b-3381a9c9c32e', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Prada Act', 'text', 'Product', 10, 17, 20, null),
  ('c513d04f-4802-4eef-8d7f-07460a99f2ca', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ant Alley Seize', 'text', 'Analysis', 10, 18, 20, null),
  ('399e63e4-ac64-4858-af37-118b9be92b55', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pass Safe Pick Oust Sun', 'text', 'Physical Fitness', 10, 19, 20, null),  -- REVIEW (low confidence)
  ('de5b90e5-f258-4ac4-b96b-c2daaa27e4e8', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Zola Reek Lips', 'text', 'Solar Eclipse', 10, 20, 20, null),
  ('b8dbe385-4ff9-40a9-981b-e321d83f1d2e', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Tray Sure Aisle Hand', 'text', 'Treasure Island', 10, 21, 20, null),
  ('b199a269-2a95-4f8d-bbc8-deb819c0fe9a', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Tie Phone', 'text', 'Typhoon', 10, 22, 20, null),
  ('c6a1b1bc-6249-48e5-8e85-dcd8d6a78f96', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Though Cue Men Tied', 'text', 'Documented', 10, 23, 20, null),
  ('692e38d0-bc70-458d-b21b-9e4eb6362c04', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ink Stay Two Shown', 'text', 'Infestation', 10, 24, 20, null),
  ('b6421c25-6ab4-4117-8975-6e35de80211b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'In No Cue Lay Shown', 'text', 'Inoculation', 10, 25, 20, null),
  ('2ff5ac38-b970-4e09-811f-df5a1788f23e', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eggs Track Shown', 'text', 'Extraction', 10, 26, 20, null),
  ('1c1d48a8-101e-45b2-aff4-7c1d0d94be26', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Add Dull Tea Ray Shown', 'text', 'Adulteration', 10, 27, 20, null),
  ('3f72bdd0-2e6b-4a0e-8758-9e62ee697e61', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Cone Tame In Ants', 'text', 'Contaminants', 10, 28, 20, null),
  ('05c0caa1-160f-4975-b8ee-97a19b913824', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Fat TwoGin', 'text', 'Pathogen', 10, 29, 20, null),
  ('bf8d64f5-cc19-43a4-ae6f-324ae202da05', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pee Stay Side', 'text', 'Pesticide', 10, 30, 20, null),
  ('2f02a24c-e75b-4653-8079-4bb2ea93d2fb', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Alley Gin', 'text', 'Allergen', 10, 31, 20, null),
  ('8763f44c-519d-4aea-b379-fd802d0a0e9b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Mic At Aux In', 'text', 'Mycotoxin', 10, 32, 20, null),
  ('89242d04-5258-4fac-b9c1-d3220494db6f', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'In Ten Grate Tee', 'text', 'Integrity', 10, 33, 20, null),
  ('2b5c0962-5460-45aa-b1bd-b2f61faf83b1', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Very Fake Key Shown', 'text', 'Verification', 10, 34, 20, null),
  ('0767f09f-4b21-4aa5-83f0-4fed1986a39f', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Mill Key Weigh', 'text', 'Milky Way', 10, 35, 20, null),
  ('59e4874c-df42-4bcb-8773-acfbca4c4dc2', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Shirt Tea Pee Key Shown', 'text', 'Certification', 10, 36, 20, null),
  ('cf802994-b338-4a51-90ed-742c8c1e11de', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Gem Men Neigh Shown', 'text', 'Germination', 10, 37, 20, null),
  ('c4443be7-2032-4f0a-b737-9ae51fe867f1', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eve Up Or Ray Shown', 'text', 'Evaporation', 10, 38, 20, null),
  ('ea5b3506-4aa5-4b29-8bb3-a5d6642cb007', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Gray Bit Tee', 'text', 'Gravity', 10, 39, 20, null),
  ('3742a608-d602-4081-b4fd-13cfb8d6cc32', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eel Leek Tree Sea Tea', 'text', 'Electricity', 10, 40, 20, null),
  ('3a707d9e-fdf6-4122-aedf-f869e8e02464', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Him Mow Glue Bane', 'text', 'Hemoglobin', 10, 41, 20, null),
  ('6a2aba12-6138-43be-a86a-5a4ca150d125', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Back Tea Ray Yeah', 'text', 'Bacteria', 10, 42, 20, null),
  ('1aab51f9-33fa-41fe-be18-076e3338dff5', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eel Leek Thrown', 'text', 'Electron', 10, 43, 20, null),
  ('58d91e8a-2ba9-4375-81db-85ed97d3cf04', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pair Rash Sight', 'text', 'Parasite', 10, 44, 20, null),
  ('6b3bf1f1-aa65-42d6-9841-92127b58ce5b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'High Beer Neigh Shawn', 'text', 'Hibernation', 10, 45, 20, null),
  ('55792a49-71b9-4453-8b63-2ab0cf6e405e', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Mic Grow Buy You Low Gee', 'text', 'Microbiology', 10, 46, 20, null),
  ('0dfbd3a2-d862-402a-83fb-9ffe7c2c0552', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Love For At Or Ray', 'text', 'Laboratory', 10, 47, 20, null),
  ('923ac95a-fdca-42e7-ac64-b57ae9b3e2ce', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'New Tray Hint', 'text', 'Nutrient', 10, 48, 20, null),
  ('afd881f4-38a1-4202-972f-466af52d6919', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ray Day Yay Shawn', 'text', 'Radiation', 10, 49, 20, null),
  ('8b02b6c5-8800-428c-9ec7-2552279ed244', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ray Pro Deuce See Bill It Tea', 'text', 'Reproducibility', 10, 50, 20, null),
  ('023fe525-575c-4b3c-8c68-5874b46a1db4', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ink Cube Bay Shun', 'text', 'Incubation', 10, 51, 20, null),
  ('aa056c30-5edd-468f-9476-cecd705cb934', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Fill Tray Shown', 'text', 'Filtration', 10, 52, 20, null),
  ('8e8000c4-5822-415c-a4df-53f4b29035ad', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Key Mist Tree', 'text', 'Chemistry', 10, 53, 20, null),
  ('eb479c91-c2a0-4d5d-bf86-794e8860d4b1', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Comb Ply Ants', 'text', 'Compliance', 10, 54, 20, null),
  ('30007a4b-5adb-4a8f-9e6c-f37a292ee2ae', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Sigh Ants', 'text', 'Science', 10, 55, 20, null),
  ('53b6b4bc-d77b-48f7-a772-665e4a51497b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Fee Six', 'text', 'Physics', 10, 56, 20, null),
  ('281e6b96-ca2e-4cec-b83f-49a125227e11', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Wand Love', 'text', 'Wavelength', 10, 57, 20, null),
  ('b2eed0d1-3d8e-4950-ba79-6634d1e96076', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Arc crow haul', 'text', 'Archival', 10, 58, 20, null),
  ('217c9447-33c3-4694-9e78-9eb4686b591c', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Send Sow Ray', 'text', 'Sensory', 10, 59, 20, null),
  ('f06998a0-4235-45a9-97bb-7f46cc5aa697', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Taste Thing', 'text', 'Testing', 10, 60, 20, null),
  ('4ec58bfa-3de1-4fba-9b7c-a9c2bb1e2cf5', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Stand Dart Day Zit Shown', 'text', 'Standardization', 10, 61, 20, null),
  ('3232a486-7c9e-4d67-855a-5cac4e74e5ff', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eve Ball You Weigh Shawn', 'text', 'Evaluation', 10, 62, 20, null),
  ('0cdaebd1-8749-4852-8d86-22884b95e7db', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Arc Cray Day Tea Shawn', 'text', 'Accreditation', 10, 63, 20, null),
  ('2b511f7b-ea41-41e4-83af-e2664719d1de', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Taller Ants', 'text', 'Tolerance', 10, 64, 20, null),
  ('4d74acd8-18da-4ff1-a79d-7a25ea4cf81d', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Eggs Peer Ray Meant', 'text', 'Experiment', 10, 65, 20, null),
  ('41775932-ce8f-4c4d-a6e2-759685b9c52d', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Mall Leigh Cue All', 'text', 'Molecule', 10, 66, 20, null),
  ('49f62c0a-c188-4d4b-9f44-5157892872b8', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Reigh Act Shoe On', 'text', 'Reaction', 10, 67, 20, null),
  ('0b7d7ec9-215b-457a-a40b-39f1b0621009', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'High Fought Tea Seas', 'text', 'Hypothesis', 10, 68, 20, null),
  ('37576bd4-437a-48fe-b692-2c7c78ef5e47', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Ant Tea Bow Day', 'text', 'Antibody', 10, 69, 20, null),
  ('fc422e6b-5787-4e0e-b5cf-f88686b7df3a', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Caught All List', 'text', 'Catalyst', 10, 70, 20, null),
  ('41753783-fdcf-4a3c-94d7-6d3092f15279', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Buy Rows', 'text', 'Virus', 10, 71, 20, null),
  ('89a58a1c-37a5-4e7e-808e-10b2de70f7fd', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Day In Aye', 'text', 'DNA', 10, 72, 20, null),
  ('70a03c48-2484-4c0a-b5a6-c0a1b15d3446', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Are In Aye', 'text', 'RNA', 10, 73, 20, null),
  ('81bc5790-fa26-49fb-a98c-38aa106b8c3f', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pro Tea In', 'text', 'Protein', 10, 74, 20, null),
  ('7faa67bc-3c27-48aa-be84-079580a5cc2b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'In Buy Row Mint', 'text', 'Environment', 10, 75, 20, null),
  ('d4dd6dee-a288-4907-a3dc-c841fcf1847b', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Tea Shoe', 'text', 'Tissue', 10, 76, 20, null),
  ('a9490b7b-07d5-4b1e-b635-52857e972e40', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'In Near Jay', 'text', 'Energy', 10, 77, 20, null),
  ('c37b16bf-6fc5-458f-8a2d-42a12b9405d1', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Pool You Shawn', 'text', 'Pollution', 10, 78, 20, null),
  ('36893fc5-d4e0-4342-8235-763489b13d2c', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Keen Neat Ticks', 'text', 'Kinetics', 10, 79, 20, null),
  ('329e2956-6fe1-4fdf-a089-79141a4ae832', '11e61619-16cb-4857-9c7d-d00cc55ba2a2', 'Back Seen', 'text', 'Vaccine', 10, 80, 20, null);

-- Name It to Win It: 8 sample rounds (dev/placeholder content -- see header).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('c6f8bad4-074c-4179-81b9-83833bfbc509', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Erlenmeyer Flask', 10, 1, 10, 'Laboratory Equipment'),
  ('05ecce6f-e4a4-41a3-8a36-06568768666d', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Bunsen Burner', 10, 2, 10, 'Chemical Laboratory Apparatus'),
  ('4bcdc4ec-fcc8-4f8b-9635-8fc827432895', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Petri Dish', 10, 3, 10, 'Microbiology Laboratory Equipment'),
  ('641c9b55-9871-460a-a0ed-b3ff725612c0', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Load Testing Chair Rig', 10, 4, 10, 'Furniture Testing Equipment'),
  ('852e2cb0-1813-44bb-8b91-65081e6a1229', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Analog Pressure Gauge', 10, 5, 10, 'Physical Testing Equipment'),
  ('c7a57e17-c9e9-4996-8ef9-b265818b99ad', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Safety Shield', 10, 6, 10, 'Laboratory Safety Equipment'),
  ('b102d921-5d71-42dc-b72e-ac609298bf36', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Vernier Caliper', 10, 7, 10, 'SI Units and Measurement Symbols'),
  ('245452ae-328e-443a-8e75-f795fca70845', 'ba6d26c0-b55f-4687-8dda-831fe26e795a', 'Name what''s pictured!', 'text', 'Periodic Table Element Symbol', 10, 8, 10, 'Chemical Symbols');

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', 'c6f8bad4-074c-4179-81b9-83833bfbc509', '/game-assets/name-it-to-win-it/laboratory-equipment.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', '05ecce6f-e4a4-41a3-8a36-06568768666d', '/game-assets/name-it-to-win-it/chemical-laboratory-apparatus.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', '4bcdc4ec-fcc8-4f8b-9635-8fc827432895', '/game-assets/name-it-to-win-it/microbiology-laboratory-equipment.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', '641c9b55-9871-460a-a0ed-b3ff725612c0', '/game-assets/name-it-to-win-it/furniture-testing-equipment.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', '852e2cb0-1813-44bb-8b91-65081e6a1229', '/game-assets/name-it-to-win-it/physical-testing-equipment.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', 'c7a57e17-c9e9-4996-8ef9-b265818b99ad', '/game-assets/name-it-to-win-it/laboratory-safety-equipment.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', 'b102d921-5d71-42dc-b72e-ac609298bf36', '/game-assets/name-it-to-win-it/si-units-and-measurement-symbols.png', 'question'),
  ('ba6d26c0-b55f-4687-8dda-831fe26e795a', '245452ae-328e-443a-8e75-f795fca70845', '/game-assets/name-it-to-win-it/chemical-symbols.png', 'question');
