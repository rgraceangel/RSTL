--------------------------------------------------------------------------------
-- Section 16d seed content: Logo Challenge, Chemical Symbol Challenge,
-- True or False, Guess the Unit, Measurement Challenge.
--
-- Chemical Symbol Challenge, True or False, Guess the Unit, and Measurement
-- Challenge are REAL, fact-checked content (periodic table, basic physics/bio
-- trivia, SI units, unit conversions) -- nothing flagged for review.
--
-- Logo Challenge is SAMPLE/DEV content by the same policy as Name It to Win
-- It (Section 16c): real company logos are trademarked, so rather than
-- reproduce or imitate anyone's actual mark, these are 8 simple generic icons
-- paired with invented, fictional brand names (public/game-assets/
-- logo-challenge/, watermarked 'SAMPLE LOGO'). Replace with your own licensed
-- logo assets any time via Admin > Games -- same ImageUpload/QuestionForm as
-- every other game type, no code changes needed.
--------------------------------------------------------------------------------

insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)
values
  ('fb2a5178-be42-4319-b443-7423355a1fd3', 'Logo Challenge', 'logo-challenge', null, 'logo_challenge', 'active', 3),
  ('97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Chemical Symbol Challenge', 'chemical-symbol-challenge', null, 'chemical_symbol_challenge', 'active', 3),
  ('19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'True or False', 'true-or-false', null, 'true_or_false', 'active', 3),
  ('8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'Guess the Unit', 'guess-the-unit', null, 'guess_the_unit', 'active', 3),
  ('2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'Measurement Challenge', 'measurement-challenge', null, 'measurement_challenge', 'active', 3)
on conflict (slug) do nothing;

-- Chemical Symbol Challenge: 15 rounds (real periodic table data).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('6bd64b09-af99-4ed8-8c7d-c2b88c4bf23a', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "H"?', 'text', 'Hydrogen', 10, 1, 20, null),
  ('b41fa662-64ba-4cb5-9147-479d85b225b0', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "He"?', 'text', 'Helium', 10, 2, 20, null),
  ('9cb5df58-1905-4b34-a3be-0e7f9cf3bb7d', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "C"?', 'text', 'Carbon', 10, 3, 20, null),
  ('406415d3-dbc1-4a7f-9b0c-238fbcfe31c3', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "N"?', 'text', 'Nitrogen', 10, 4, 20, null),
  ('b9f0389d-8e88-4a7b-8e41-fb8a52ef49b5', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "O"?', 'text', 'Oxygen', 10, 5, 20, null),
  ('72463b82-0e7b-487d-92fc-0abcfaa3d79c', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Na"?', 'text', 'Sodium', 10, 6, 20, null),
  ('739327e7-dea1-40da-b96c-f53347ef1bf4', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Mg"?', 'text', 'Magnesium', 10, 7, 20, null),
  ('c8fc0c59-ac0c-4db3-8d41-9690bd91f4dd', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Cl"?', 'text', 'Chlorine', 10, 8, 20, null),
  ('70abd7b2-708e-4860-be92-ca3ebbac8d67', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "K"?', 'text', 'Potassium', 10, 9, 20, null),
  ('cd3852e0-1931-487d-adc3-6ed9f61bd169', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Ca"?', 'text', 'Calcium', 10, 10, 20, null),
  ('1076d836-90d3-4a0d-96cf-cae0eb4b93f3', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Fe"?', 'text', 'Iron', 10, 11, 20, null),
  ('a9505392-88d6-436a-add3-66d5dd451298', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Cu"?', 'text', 'Copper', 10, 12, 20, null),
  ('c943fec8-a1c2-4a31-bfa8-5c6946ec1265', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Ag"?', 'text', 'Silver', 10, 13, 20, null),
  ('7499ea5d-e401-4249-8568-7bfc8d8910b0', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Au"?', 'text', 'Gold', 10, 14, 20, null),
  ('73518961-4ef6-46b9-a2ff-06ae25c01d22', '97b47a8a-b13f-4558-b53e-a692128a9cf3', 'Which element has the chemical symbol "Zn"?', 'text', 'Zinc', 10, 15, 20, null);

-- True or False: 15 rounds (real, fact-checked trivia).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, explanation, points, order_index, time_limit_seconds, category)
values
  ('eaed1b8b-d330-4bf0-8fac-b6abacacae4b', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'The sun is a star.', 'true_false', 'true', 'The Sun is a G-type main-sequence star, the closest one to Earth.', 10, 1, 15, null),
  ('0b1dad9b-1256-4760-98b2-1cd1583851e3', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Humans have 206 bones in their adult skeleton.', 'true_false', 'true', 'Babies are born with about 300 bones; many fuse together by adulthood.', 10, 2, 15, null),
  ('d444693f-52fb-4cae-826d-4917dd09d77d', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Sound travels faster in water than in air.', 'true_false', 'true', 'Sound moves about 4 times faster in water than in air.', 10, 3, 15, null),
  ('f164c4f6-1b3c-49b4-9bd3-6f8b68cccace', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'The Great Wall of China is visible from space with the naked eye.', 'true_false', 'false', 'A persistent myth -- it''s not distinguishable from orbit without aid.', 10, 4, 15, null),
  ('83adfe64-6508-44a1-a96e-02a64ef314e2', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Lightning is hotter than the surface of the sun.', 'true_false', 'true', 'A lightning bolt can reach ~30,000 K, far hotter than the Sun''s ~5,800 K surface.', 10, 5, 15, null),
  ('579a9cc8-b9aa-4ec6-a8d3-7b98e85b01ef', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'A group of lions is called a pride.', 'true_false', 'true', 'A pride of lions typically includes related females, their cubs, and a few males.', 10, 6, 15, null),
  ('6c621cd6-f06f-4a0c-8928-c7b45a9bacbc', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Bats are blind.', 'true_false', 'false', 'Bats can see; many species also use echolocation to navigate in the dark.', 10, 7, 15, null),
  ('f73218a7-5030-4781-8de7-92f9cc2d6eb6', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'The Earth''s core is made mostly of iron and nickel.', 'true_false', 'true', 'The inner and outer core are primarily an iron-nickel alloy.', 10, 8, 15, null),
  ('0f29312d-8479-4927-b85c-77714b16ca0d', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Diamonds are made of carbon.', 'true_false', 'true', 'Diamond is a crystal structure of pure carbon, as is graphite.', 10, 9, 15, null),
  ('f2417a23-d1d2-415c-8a08-54d9df7ac3dc', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Goldfish have a memory span of only three seconds.', 'true_false', 'false', 'Studies show goldfish can remember things for months.', 10, 10, 15, null),
  ('3a74a202-c3ce-43a4-81b7-61b71de50da7', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'The human body has four lungs.', 'true_false', 'false', 'Humans have two lungs, a left and a right.', 10, 11, 15, null),
  ('13ac40f5-afe8-4444-a7e9-cd0b289a25df', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Venus is the hottest planet in the solar system.', 'true_false', 'true', 'Venus''s thick CO2 atmosphere traps heat, making it hotter than Mercury despite being farther from the Sun.', 10, 12, 15, null),
  ('a27161af-f833-43ac-a07f-c4c346232c72', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Sharks are mammals.', 'true_false', 'false', 'Sharks are fish (cartilaginous fish), not mammals.', 10, 13, 15, null),
  ('0fd2c3c2-d823-4dfd-8c8d-c94f01d51013', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'Water expands when it freezes.', 'true_false', 'true', 'Ice is less dense than liquid water, which is why it floats.', 10, 14, 15, null),
  ('400dd124-50d2-4ec1-9b86-3f074d55623c', '19f6c709-dcfe-4554-b3e9-df9cf899dc16', 'The Sahara Desert is the largest desert in the world.', 'true_false', 'false', 'Antarctica, a cold desert, is the largest by area -- the Sahara is only the largest hot desert.', 10, 15, 15, null);

-- Guess the Unit: 15 rounds (real SI/measurement units).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('10df2709-4225-4ca2-88f3-afed05d0c69f', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Force?', 'text', 'Newton', 10, 1, 20, null),
  ('a3e666c0-a68d-481c-9f86-66cdbc3a1825', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Energy?', 'text', 'Joule', 10, 2, 20, null),
  ('d93f40e9-cdc5-4e29-9e63-02b51ec7aa4b', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Power?', 'text', 'Watt', 10, 3, 20, null),
  ('2b3be889-c17e-478a-96ce-b8d5694195be', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Pressure?', 'text', 'Pascal', 10, 4, 20, null),
  ('f9ae54a8-0cfd-4a7f-9524-85fbb9c2ec8b', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Frequency?', 'text', 'Hertz', 10, 5, 20, null),
  ('3a5dd3df-2352-4f92-833a-581ffa6d94ba', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Electric Current?', 'text', 'Ampere', 10, 6, 20, null),
  ('74bdd236-6b72-4706-83c0-93545b023917', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Electric Charge?', 'text', 'Coulomb', 10, 7, 20, null),
  ('c21691fa-fd52-46c4-8c44-c4fcfdc02571', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Electric Resistance?', 'text', 'Ohm', 10, 8, 20, null),
  ('ed1c726e-fb7e-485c-afe9-6f0a2a6eacf7', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Voltage?', 'text', 'Volt', 10, 9, 20, null),
  ('a674201d-4cc3-4379-bf9c-14109f35f73b', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Mass?', 'text', 'Kilogram', 10, 10, 20, null),
  ('d0dd57f9-1c41-4ed0-9ef0-aeed8673341b', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Time?', 'text', 'Second', 10, 11, 20, null),
  ('d871b6f7-85fc-40c9-a1e1-84d226f53659', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Amount of Substance?', 'text', 'Mole', 10, 12, 20, null),
  ('654ab22c-869e-429b-8b87-eb8a36919cbe', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Luminous Intensity?', 'text', 'Candela', 10, 13, 20, null),
  ('3c7ff719-7ad9-4ec4-9a91-588339efa02e', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Capacitance?', 'text', 'Farad', 10, 14, 20, null),
  ('0a949b5a-0603-45b4-9fcc-a7346ce4d409', '8e3c2960-14bb-4a6c-a1ef-d49dd22d58ef', 'What is the SI unit of Radioactivity?', 'text', 'Becquerel', 10, 15, 20, null);

-- Measurement Challenge: 12 rounds (real conversions/readings).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('7a8197bc-de0c-4a40-a034-798bc16ff4e1', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'A thermometer reads 100 degrees Celsius. What is this in Fahrenheit? (just the number)', 'text', '212', 10, 1, 25, null),
  ('721225f6-3e04-4f97-9328-3e73bd474df8', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many grams are in 2.5 kilograms? (just the number)', 'text', '2500', 10, 2, 25, null),
  ('37c6c833-405a-4e48-b9cf-3af146e20546', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many centimeters are in 1.5 meters? (just the number)', 'text', '150', 10, 3, 25, null),
  ('9e73368a-e4ed-4df4-b3f9-ebf548ca5a1e', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many milliliters are in 2 liters? (just the number)', 'text', '2000', 10, 4, 25, null),
  ('1f251e64-e0d1-4de7-a273-2c8e425dbae8', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many seconds are in 3 minutes? (just the number)', 'text', '180', 10, 5, 25, null),
  ('54746d2e-01de-483d-bb2f-0da73383e0d6', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'A recipe calls for 1 kilogram of flour. How many grams is that? (just the number)', 'text', '1000', 10, 6, 25, null),
  ('53954716-f8b4-4fae-bcc2-1b86c7f5d689', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many millimeters are in 5 centimeters? (just the number)', 'text', '50', 10, 7, 25, null),
  ('d9abe328-ae97-4f36-99cd-ecaca3800696', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'Water boils at 100 degrees Celsius at sea level. What is this in Kelvin? (nearest whole number, just the number)', 'text', '373', 10, 8, 25, null),
  ('14d95faa-dd02-42f9-9259-65beac972a14', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many meters are in 2 kilometers? (just the number)', 'text', '2000', 10, 9, 25, null),
  ('611c7176-2ad7-4660-9c84-fee4e8e7fcbc', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'A car travels 60 kilometers in 1 hour at a constant speed. What is its speed in km/h? (just the number)', 'text', '60', 10, 10, 25, null),
  ('93826a17-5a14-4a61-bf98-79376513151d', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', '0 degrees Celsius is what temperature in Kelvin? (nearest whole number, just the number)', 'text', '273', 10, 11, 25, null),
  ('8205e525-d0ab-4654-893e-9db33d331f8e', '2a02f75d-7d87-472d-a9c9-149c3e5a0926', 'How many grams are in 1 kilogram? (just the number)', 'text', '1000', 10, 12, 25, null);

-- Logo Challenge: 8 sample rounds (fictional brands/icons -- see header).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('198ecb02-9ff8-4ce1-98b3-415c25c65469', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Greenline', 10, 1, 15, 'Sample Logos'),
  ('b2c33b25-8cfe-4290-8203-fd00cdfa8a90', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Peak Systems', 10, 2, 15, 'Sample Logos'),
  ('0977f519-861a-40b4-9be9-bd371d3a0f01', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Solara', 10, 3, 15, 'Sample Logos'),
  ('1698652a-f32d-45e7-87ab-67e692010c76', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Fortify', 10, 4, 15, 'Sample Logos'),
  ('c0032a4f-d4df-497f-96a6-adf39df56af0', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Wavelength Media', 10, 5, 15, 'Sample Logos'),
  ('380e0b03-f4bf-4176-81d9-c635dcdcd7f6', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Voltek', 10, 6, 15, 'Sample Logos'),
  ('068b2797-1e77-446c-84e2-a79932815f40', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'AquaPure', 10, 7, 15, 'Sample Logos'),
  ('09965e65-af0c-4186-983f-6a6164e678f7', 'fb2a5178-be42-4319-b443-7423355a1fd3', 'Name the brand!', 'text', 'Gearworks', 10, 8, 15, 'Sample Logos');

insert into public.game_images (game_id, question_id, image_url, image_type)
values
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '198ecb02-9ff8-4ce1-98b3-415c25c65469', '/game-assets/logo-challenge/greenline.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', 'b2c33b25-8cfe-4290-8203-fd00cdfa8a90', '/game-assets/logo-challenge/peak-systems.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '0977f519-861a-40b4-9be9-bd371d3a0f01', '/game-assets/logo-challenge/solara.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '1698652a-f32d-45e7-87ab-67e692010c76', '/game-assets/logo-challenge/fortify.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', 'c0032a4f-d4df-497f-96a6-adf39df56af0', '/game-assets/logo-challenge/wavelength-media.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '380e0b03-f4bf-4176-81d9-c635dcdcd7f6', '/game-assets/logo-challenge/voltek.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '068b2797-1e77-446c-84e2-a79932815f40', '/game-assets/logo-challenge/aquapure.png', 'question'),
  ('fb2a5178-be42-4319-b443-7423355a1fd3', '09965e65-af0c-4186-983f-6a6164e678f7', '/game-assets/logo-challenge/gearworks.png', 'question');
