--------------------------------------------------------------------------------
-- Section 16g seed content: Calibration Challenge, Science Bingo, Science Facts,
-- Mini Crossword, Wheel of Science Facts.
--
-- All REAL, directly-authored/fact-checked content. None of these five games
-- use images -- pure text/multiple_choice/true_false rounds, same as True or
-- False, Guess the Unit, and Emoji Science before them.
--------------------------------------------------------------------------------

insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)
values
  ('76d5f32f-c306-4ced-af1e-9380ff012845', 'Calibration Challenge', 'calibration-challenge', null, 'calibration_challenge', 'active', 3),
    ('9944104b-3c17-430e-96f2-4abf088bde60', 'Science Bingo', 'science-bingo', null, 'science_bingo', 'active', 3),
    ('7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Science Facts', 'science-facts', null, 'science_facts', 'active', 3),
    ('ca30e104-c218-46d2-8eee-0db0d6512b83', 'Mini Crossword', 'mini-crossword', null, 'mini_crossword', 'active', 3),
    ('317396f7-dcdc-4382-afac-3ea928ad2468', 'Wheel of Science Facts', 'wheel-of-science-facts', null, 'wheel_of_science_facts', 'active', 3)
on conflict (slug) do nothing;

-- Calibration Challenge: 15 rounds (real metrology/calibration concepts, mixed true_false/text).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, explanation, points, order_index, time_limit_seconds, category)
values
  ('b3ee44ea-faac-413d-a63c-d5d719fdfeb0', '76d5f32f-c306-4ced-af1e-9380ff012845', 'Calibration compares a measuring instrument''s readings against a known reference standard.', 'true_false', 'true', 'That''s the core definition of calibration.', 10, 1, 15, null),
    ('d575b495-aeee-426d-a186-cf4d5b03fb23', '76d5f32f-c306-4ced-af1e-9380ff012845', 'Once an instrument is calibrated, it never needs to be recalibrated again.', 'true_false', 'false', 'Instruments drift over time and with use, so recalibration on a set interval is required.', 10, 2, 15, null),
    ('ec107ae2-46cd-4f62-8e6b-2054839dbb27', '76d5f32f-c306-4ced-af1e-9380ff012845', 'A calibration standard mass is labeled 100.00 g. The balance reads 100.05 g. What is the error, in grams? (just the number)', 'text', '0.05', null, 10, 3, 25, null),
    ('a2890b01-151d-412b-804b-6c283cffbc10', '76d5f32f-c306-4ced-af1e-9380ff012845', 'A thermometer calibration reference reads 0.0 degrees Celsius at the ice point. Your thermometer reads 0.4 degrees Celsius. What is the error, in degrees Celsius? (just the number)', 'text', '0.4', null, 10, 4, 25, null),
    ('a8a54279-021d-4e1a-a894-9f750cf37944', '76d5f32f-c306-4ced-af1e-9380ff012845', 'A calibration certificate typically states the traceability of the reference standard used.', 'true_false', 'true', 'Traceability back to a national or international standard is a standard part of a calibration certificate.', 10, 5, 15, null),
    ('badd102a-ea00-493e-87e8-c5f2e116cc5f', '76d5f32f-c306-4ced-af1e-9380ff012845', 'Calibration and verification mean exactly the same thing.', 'true_false', 'false', 'Calibration establishes the relationship to a reference; verification confirms the instrument still meets its required accuracy -- related but distinct.', 10, 6, 15, null),
    ('90c1d4b7-accf-4659-912b-a806256f80d7', '76d5f32f-c306-4ced-af1e-9380ff012845', 'The acceptable tolerance for a 500 mL volumetric flask is plus or minus 0.20 mL. It measures 500.15 mL. Is it within tolerance? Answer Yes or No.', 'text', 'Yes', null, 10, 7, 25, null),
    ('398b1142-103a-4714-be8d-1b9d7e47177a', '76d5f32f-c306-4ced-af1e-9380ff012845', 'The acceptable tolerance for a 500 mL volumetric flask is plus or minus 0.20 mL. It measures 500.35 mL. Is it within tolerance? Answer Yes or No.', 'text', 'No', null, 10, 8, 25, null),
    ('0fafe529-d913-4107-874d-a678f1652cdf', '76d5f32f-c306-4ced-af1e-9380ff012845', 'A pH meter should be calibrated using buffer solutions of known pH.', 'true_false', 'true', 'Standard buffer solutions (commonly pH 4, 7, and 10) are used to calibrate pH meters.', 10, 9, 15, null),
    ('df06f26f-6b60-4e49-9054-8326e9874d5f', '76d5f32f-c306-4ced-af1e-9380ff012845', 'Environmental factors like temperature and humidity have no effect on calibration accuracy.', 'true_false', 'false', 'Temperature and humidity can meaningfully affect many instruments'' readings, which is why calibration is often done under controlled conditions.', 10, 10, 15, null),
    ('1961f3b1-4081-4579-8b1f-525c9f8832b9', '76d5f32f-c306-4ced-af1e-9380ff012845', 'What do we call the smallest change a measuring instrument can detect and display?', 'text', 'Resolution', null, 10, 11, 25, null),
    ('e4ac8d8e-378f-4a26-b6cb-e43138dfba7b', '76d5f32f-c306-4ced-af1e-9380ff012845', 'What do we call the closeness of a measured value to the true or accepted value?', 'text', 'Accuracy', null, 10, 12, 25, null),
    ('725ebdbb-113f-46db-91a5-24cff9458216', '76d5f32f-c306-4ced-af1e-9380ff012845', 'What do we call the closeness of agreement between repeated measurements of the same quantity?', 'text', 'Precision', null, 10, 13, 25, null),
    ('91b4267a-2677-4538-8930-dc50872274ff', '76d5f32f-c306-4ced-af1e-9380ff012845', 'A calibration interval is the length of time between successive calibrations of an instrument.', 'true_false', 'true', 'That''s the standard definition of a calibration interval.', 10, 14, 15, null),
    ('73c874c2-7dfe-4618-a879-44bda12c8f5a', '76d5f32f-c306-4ced-af1e-9380ff012845', 'What term describes an unbroken chain of comparisons linking a measurement to a national or international standard?', 'text', 'Traceability', null, 10, 15, 25, null);

-- Science Bingo: 15 rounds (real science-vocabulary clue-to-term matching).
insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('b4af0c0e-8f89-4340-b50e-7bb92bd8191c', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of living organisms.', 'multiple_choice', '[{"id": "b", "text": "Chemistry"}, {"id": "d", "text": "Geology"}, {"id": "a", "text": "Biology"}, {"id": "c", "text": "Physics"}]'::jsonb, 'a', 10, 1, 20, null),
    ('97b81481-50ab-43c2-a19e-68b80c876c21', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of matter and its properties and how it changes.', 'multiple_choice', '[{"id": "c", "text": "Astronomy"}, {"id": "b", "text": "Biology"}, {"id": "a", "text": "Chemistry"}, {"id": "d", "text": "Physics"}]'::jsonb, 'a', 10, 2, 20, null),
    ('6effe060-c731-48ee-90b5-0b77dfd0c6db', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of energy, forces, and motion.', 'multiple_choice', '[{"id": "c", "text": "Geology"}, {"id": "b", "text": "Chemistry"}, {"id": "d", "text": "Biology"}, {"id": "a", "text": "Physics"}]'::jsonb, 'a', 10, 3, 20, null),
    ('e105197a-fdfb-45e2-81a0-f4f173e8b6b1', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of celestial objects, space, and the universe.', 'multiple_choice', '[{"id": "d", "text": "Physics"}, {"id": "a", "text": "Astronomy"}, {"id": "b", "text": "Geology"}, {"id": "c", "text": "Meteorology"}]'::jsonb, 'a', 10, 4, 20, null),
    ('2712a866-a286-465a-be40-530955daeea5', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of the Earth''s physical structure and substance.', 'multiple_choice', '[{"id": "d", "text": "Meteorology"}, {"id": "b", "text": "Astronomy"}, {"id": "a", "text": "Geology"}, {"id": "c", "text": "Biology"}]'::jsonb, 'a', 10, 5, 20, null),
    ('d2a77cf8-343f-480c-a8cd-76d55a831897', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The study of weather and the atmosphere.', 'multiple_choice', '[{"id": "a", "text": "Meteorology"}, {"id": "b", "text": "Geology"}, {"id": "c", "text": "Astronomy"}, {"id": "d", "text": "Biology"}]'::jsonb, 'a', 10, 6, 20, null),
    ('5694ffa9-2e33-4ab5-8303-c1aff904bc8b', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The scientific method step where you form a testable explanation.', 'multiple_choice', '[{"id": "b", "text": "Theory"}, {"id": "c", "text": "Law"}, {"id": "d", "text": "Observation"}, {"id": "a", "text": "Hypothesis"}]'::jsonb, 'a', 10, 7, 20, null),
    ('2d74b8c7-b05c-45d9-bda4-49dbf56d0ed1', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: A well-substantiated explanation acquired through the scientific method, repeatedly tested and confirmed.', 'multiple_choice', '[{"id": "b", "text": "Hypothesis"}, {"id": "a", "text": "Theory"}, {"id": "d", "text": "Guess"}, {"id": "c", "text": "Law"}]'::jsonb, 'a', 10, 8, 20, null),
    ('69beac85-af2f-4792-b566-2bf52110f519', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: A statement that describes an observed pattern in nature, without explaining why.', 'multiple_choice', '[{"id": "b", "text": "Theory"}, {"id": "a", "text": "Law"}, {"id": "d", "text": "Rule"}, {"id": "c", "text": "Hypothesis"}]'::jsonb, 'a', 10, 9, 20, null),
    ('e8ad9ba8-d2d3-4e0d-b86a-4c3c226630e3', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The smallest unit of an element that retains its chemical properties.', 'multiple_choice', '[{"id": "d", "text": "Ion"}, {"id": "b", "text": "Molecule"}, {"id": "c", "text": "Cell"}, {"id": "a", "text": "Atom"}]'::jsonb, 'a', 10, 10, 20, null),
    ('3e294c4f-dff4-464e-8c26-9375b6a08929', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: The basic structural and functional unit of all living organisms.', 'multiple_choice', '[{"id": "d", "text": "Organ"}, {"id": "a", "text": "Cell"}, {"id": "b", "text": "Atom"}, {"id": "c", "text": "Tissue"}]'::jsonb, 'a', 10, 11, 20, null),
    ('aa6cc513-6b85-4748-9322-0252d73ff246', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: Two or more atoms bonded together.', 'multiple_choice', '[{"id": "b", "text": "Compound"}, {"id": "d", "text": "Ion"}, {"id": "a", "text": "Molecule"}, {"id": "c", "text": "Atom"}]'::jsonb, 'a', 10, 12, 20, null),
    ('4f585efa-95e7-417d-8a31-f223016ce3a0', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: A pure substance made of two or more different elements chemically bonded in a fixed ratio.', 'multiple_choice', '[{"id": "c", "text": "Mixture"}, {"id": "d", "text": "Element"}, {"id": "a", "text": "Compound"}, {"id": "b", "text": "Molecule"}]'::jsonb, 'a', 10, 13, 20, null),
    ('5ba61306-143c-4d53-9199-5633c7e999dd', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: A substance that cannot be broken down into simpler substances by chemical means.', 'multiple_choice', '[{"id": "c", "text": "Mixture"}, {"id": "b", "text": "Compound"}, {"id": "d", "text": "Atom"}, {"id": "a", "text": "Element"}]'::jsonb, 'a', 10, 14, 20, null),
    ('d8610ca9-ad72-4683-bc28-d3252a59cdd1', '9944104b-3c17-430e-96f2-4abf088bde60', 'Bingo call: A material made of two or more substances that are physically combined, not chemically bonded.', 'multiple_choice', '[{"id": "d", "text": "Element"}, {"id": "c", "text": "Solution"}, {"id": "b", "text": "Compound"}, {"id": "a", "text": "Mixture"}]'::jsonb, 'a', 10, 15, 20, null);

-- Science Facts: 20 rounds (real, fill-in-the-blank science facts).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('ed139e54-5514-46e5-9f96-b0460f605d7c', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: Water boils at ___ degrees Celsius at sea level. (just the number)', 'text', '100', 10, 1, 20, null),
    ('263ee108-e706-4f33-9108-575f5ea67e9f', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: Water freezes at ___ degrees Celsius at sea level. (just the number)', 'text', '0', 10, 2, 20, null),
    ('d2800105-d9ed-47a0-9dc2-2fc63afb6b9a', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The chemical formula for water is ___.', 'text', 'H2O', 10, 3, 20, null),
    ('fbe7ecba-f98b-42de-a5f0-2169557a975e', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The powerhouse of the cell is the ___.', 'text', 'Mitochondria', 10, 4, 20, null),
    ('030f6801-a0d4-46f6-99fb-9f9f8d14ba30', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The closest planet to the Sun is ___.', 'text', 'Mercury', 10, 5, 20, null),
    ('d73a2224-f898-4d76-88bd-d6cec4ed3647', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The largest planet in our solar system is ___.', 'text', 'Jupiter', 10, 6, 20, null),
    ('960ace31-eb86-4d47-90bd-f264625d0843', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The speed of light is approximately ___ km/s. (just the number, rounded)', 'text', '300000', 10, 7, 20, null),
    ('63e952b1-026e-4b75-8b54-226eb2861abb', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The process by which plants make their own food using sunlight is called ___.', 'text', 'Photosynthesis', 10, 8, 20, null),
    ('6a9f483f-c8c7-4f44-bfe6-3f46cd56efec', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The gas that plants absorb from the air for photosynthesis is ___.', 'text', 'Carbon Dioxide', 10, 9, 20, null),
    ('e93b6c0f-0a59-4557-ba6d-858c64ca080f', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The gas that humans need to breathe to survive is ___.', 'text', 'Oxygen', 10, 10, 20, null),
    ('dadc1480-8817-4aad-a38b-891078431f91', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The pH value of a neutral solution is ___. (just the number)', 'text', '7', 10, 11, 20, null),
    ('105f6e9b-983e-4218-8b58-50995ab0d5f4', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The number of bones in an adult human body is ___. (just the number)', 'text', '206', 10, 12, 20, null),
    ('27eb03da-9bc5-438c-96cc-5228f61870ee', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The largest organ in the human body is the ___.', 'text', 'Skin', 10, 13, 20, null),
    ('64766ae2-a892-4862-8599-3f64d2df531b', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The force that pulls objects toward the center of the Earth is called ___.', 'text', 'Gravity', 10, 14, 20, null),
    ('003d1a67-620f-4ee0-8eeb-c0b0532165aa', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The basic unit of heredity that carries genetic information is called a ___.', 'text', 'Gene', 10, 15, 20, null),
    ('34428538-afe7-40aa-9add-5fce417a9442', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: Sound cannot travel through a ___.', 'text', 'Vacuum', 10, 16, 20, null),
    ('ff71f6f6-3bde-47ca-b4e8-4029f5b7b155', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The layer of gases surrounding Earth is called the ___.', 'text', 'Atmosphere', 10, 17, 20, null),
    ('5a5060a1-fb31-4a48-9425-77c1c0f1dad5', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The chemical symbol for gold is ___.', 'text', 'Au', 10, 18, 20, null),
    ('48877449-4616-4d2a-943c-3137cfa3d49f', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The study of fossils is called ___.', 'text', 'Paleontology', 10, 19, 20, null),
    ('d15e6569-b6cb-4da2-9bf7-4ff96d16e3b1', '7c0ca941-3f6d-444b-9b4f-1bd696090371', 'Complete the fact: The center of an atom, containing protons and neutrons, is called the ___.', 'text', 'Nucleus', 10, 20, 20, null);

-- Mini Crossword: 15 rounds (single crossword-style clue + letter-count hint, real vocabulary).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)
values
  ('30879498-b4b3-4bd1-ba5a-ec783eb482ad', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '5 letters: A narrow-necked container used to mix or heat chemicals.', 'text', 'Flask', 10, 1, 25, null),
    ('121d39d8-45d7-4b20-b74f-56a5e8f5acf4', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: A cylindrical container with a pour spout, used to hold liquids.', 'text', 'Beaker', 10, 2, 25, null),
    ('e737ca5b-78dd-4232-b3d3-6211a738f077', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '4 letters: The smallest unit of an element.', 'text', 'Atom', 10, 3, 25, null),
    ('11641a25-d729-45e4-9c16-7632811d27ef', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '4 letters: The basic unit of life.', 'text', 'Cell', 10, 4, 25, null),
    ('f5155ad2-b50d-4b3e-baf9-43d4c3e15fc1', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: The capacity to do work.', 'text', 'Energy', 10, 5, 25, null),
    ('c53962e5-fdf4-477d-9922-b416e0007cbe', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: Anything that has mass and takes up space.', 'text', 'Matter', 10, 6, 25, null),
    ('67acfcce-e53a-412e-a539-3616e65ba976', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '7 letters: Mass divided by volume.', 'text', 'Density', 10, 7, 25, null),
    ('46b7dce7-fd5c-4acd-8778-4ae116d9b663', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '7 letters: The force that pulls objects toward Earth.', 'text', 'Gravity', 10, 8, 25, null),
    ('9327829b-e01b-44d4-8c8d-fce1d8680afd', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: A protein that speeds up chemical reactions in the body.', 'text', 'Enzyme', 10, 9, 25, null),
    ('f26f400b-dfc7-442b-9da3-8210b853f43a', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: The amount of space an object occupies.', 'text', 'Volume', 10, 10, 25, null),
    ('14eabb29-29c1-45b8-b9f8-3d3bdd6f4847', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '4 letters: A substance with a pH less than 7.', 'text', 'Acid', 10, 11, 25, null),
    ('06d6e19e-6b6f-44f3-abf6-366f41d93943', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '4 letters: A substance with a pH greater than 7.', 'text', 'Base', 10, 12, 25, null),
    ('a0dd90e8-6a34-488a-934e-7bf2f7f4ad12', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '5 letters: The curved path an object takes around another in space.', 'text', 'Orbit', 10, 13, 25, null),
    ('706cada4-8238-4f5d-897c-77483585344a', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '6 letters: The preserved remains or trace of an ancient organism.', 'text', 'Fossil', 10, 14, 25, null),
    ('c7859833-e768-4221-8750-2805776d2f5f', 'ca30e104-c218-46d2-8eee-0db0d6512b83', '7 letters: The natural environment where an organism lives.', 'text', 'Habitat', 10, 15, 25, null);

-- Wheel of Science Facts: 15 rounds (real "did you know" science trivia, distinct from the 16d True or False set).
insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, explanation, points, order_index, time_limit_seconds, category)
values
  ('74744d95-09c9-4797-ae43-32ff5200a2fb', '317396f7-dcdc-4382-afac-3ea928ad2468', 'A group of crows is called a murder.', 'true_false', 'true', 'This is a real, traditional collective noun for crows.', 10, 1, 15, null),
    ('55db7ca2-495e-4c26-94d7-a2f35c49bd98', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Honey never spoils if stored properly.', 'true_false', 'true', 'Honey''s low moisture and acidity make it naturally resistant to spoilage indefinitely.', 10, 2, 15, null),
    ('af0bb564-d44b-4a5c-b169-7fbce6ee4813', '317396f7-dcdc-4382-afac-3ea928ad2468', 'The human body has more bacterial cells than human cells.', 'true_false', 'true', 'Widely cited estimates put the ratio at roughly 1:1 to 10:1 in favor of bacteria, depending on the study.', 10, 3, 15, null),
    ('c5cc3323-94c0-43d2-9851-77ec1d4cc9ba', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Octopuses have three hearts.', 'true_false', 'true', 'Two pump blood to the gills, and one pumps it to the rest of the body.', 10, 4, 15, null),
    ('8c7668fe-bc49-4554-8129-4cee68339630', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Bananas are berries, but strawberries are not, botanically speaking.', 'true_false', 'true', 'Botanically, a berry develops from a single ovary; bananas qualify, strawberries do not.', 10, 5, 15, null),
    ('3760e613-0ca0-4870-8256-2d0c0e91278b', '317396f7-dcdc-4382-afac-3ea928ad2468', 'The Eiffel Tower can grow taller in the summer due to thermal expansion.', 'true_false', 'true', 'Heat causes the iron structure to expand, adding several centimeters to its height.', 10, 6, 15, null),
    ('314bf331-4d50-4d81-af36-d104ee9d1757', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Mount Everest is the tallest mountain on Earth measured from base to peak.', 'true_false', 'false', 'Mauna Kea in Hawaii is taller measured base to peak, though Everest has the highest peak above sea level.', 10, 7, 15, null),
    ('bfa61858-7524-4d9a-a421-ddfc1e7ba4a2', '317396f7-dcdc-4382-afac-3ea928ad2468', 'A jiffy is an actual unit of time in physics.', 'true_false', 'true', 'A jiffy is used informally in physics and computing to mean a very short, specific interval of time.', 10, 8, 15, null),
    ('505f6842-e7eb-4364-8f9b-d245d0bdf68f', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Humans can hear all frequencies of sound waves.', 'true_false', 'false', 'Human hearing is limited to roughly 20 Hz to 20,000 Hz; many animals hear frequencies outside this range.', 10, 9, 15, null),
    ('5cf49521-2802-4f11-b465-67148f124327', '317396f7-dcdc-4382-afac-3ea928ad2468', 'The Great Barrier Reef is the largest living structure on Earth.', 'true_false', 'true', 'It''s the largest structure made by living organisms, visible even from space.', 10, 10, 15, null),
    ('d9cb7738-00e4-436a-aa46-decd510c98ae', '317396f7-dcdc-4382-afac-3ea928ad2468', 'All metals are magnetic.', 'true_false', 'false', 'Only a few metals, like iron, nickel, and cobalt, are strongly magnetic; most metals are not.', 10, 11, 15, null),
    ('1a85d7bb-09df-45ee-a1ff-f292090db821', '317396f7-dcdc-4382-afac-3ea928ad2468', 'The human nose can distinguish over one trillion different scents.', 'true_false', 'true', 'A widely cited 2014 study estimated human scent discrimination at over a trillion odors.', 10, 12, 15, null),
    ('96c0cdca-336c-4805-a9dc-b9c2ae694c7c', '317396f7-dcdc-4382-afac-3ea928ad2468', 'Glass is a slow-flowing liquid at room temperature.', 'true_false', 'false', 'This is a persistent myth -- glass is an amorphous solid and does not flow at room temperature.', 10, 13, 15, null),
    ('c8b05b2d-4100-45ab-a6b4-fd349f589538', '317396f7-dcdc-4382-afac-3ea928ad2468', 'There are more possible variations of a game of chess than atoms in the observable universe.', 'true_false', 'true', 'The number of possible chess games vastly exceeds estimates of atoms in the observable universe.', 10, 14, 15, null),
    ('f568647b-e80b-44cd-81c1-08aca318a35a', '317396f7-dcdc-4382-afac-3ea928ad2468', 'A day on Venus is longer than a year on Venus.', 'true_false', 'true', 'Venus rotates so slowly that one day (one full rotation) takes longer than one Venusian year (one orbit of the Sun).', 10, 15, 15, null);
