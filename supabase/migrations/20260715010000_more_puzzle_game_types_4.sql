--------------------------------------------------------------------------------
-- Section 16g: five more player-facing game types --
--   'calibration_challenge'   -- calibration/metrology concepts and simple tolerance checks
--   'science_bingo'            -- "bingo call" clue -> matching science term
--   'science_facts'            -- fill-in-the-blank science facts
--   'mini_crossword'           -- single crossword-style clue with a letter-count hint
--   'wheel_of_science_facts'   -- true/false "did you know" science facts
--
-- Exactly like Section 16c/16d/16e/16f: all five are the same "quiz" engine
-- underneath (question_text/options/correct_answer/points/
-- time_limit_seconds/explanation, checked by the existing check_quiz_answer
-- RPC), just with different question_type per round (`multiple_choice`,
-- `true_false`, or `text`). None of these five need images, so no new
-- game_images rows this phase. No schema changes needed beyond widening the
-- game_type check constraint -- everything else already exists from
-- 16c/16d/16e/16f.
--------------------------------------------------------------------------------

alter table public.games drop constraint if exists games_game_type_check;
alter table public.games add constraint games_game_type_check
  check (game_type in (
    'quiz',
    'spin_wheel',
    'claw_machine',
    'scratch_card',
    'slot_machine',
    'decoder',
    'guess_the_gibberish',
    'name_it_to_win_it',
    'logo_challenge',
    'chemical_symbol_challenge',
    'true_or_false',
    'guess_the_unit',
    'measurement_challenge',
    'equipment_match',
    'which_laboratory',
    'hazard_symbol',
    'odd_one_out',
    'word_scramble',
    'emoji_science',
    'picture_puzzle',
    'memory_challenge',
    'spot_the_difference',
    'ppe_challenge',
    'calibration_challenge',
    'science_bingo',
    'science_facts',
    'mini_crossword',
    'wheel_of_science_facts'
  ));
