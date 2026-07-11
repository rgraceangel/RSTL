--------------------------------------------------------------------------------
-- Section 16d: five more player-facing game types --
--   'logo_challenge'             -- image-based "name the logo" quiz, categorized
--   'chemical_symbol_challenge'  -- name the element from its chemical symbol
--   'true_or_false'              -- dedicated true/false trivia game
--   'guess_the_unit'             -- name the SI/measurement unit
--   'measurement_challenge'      -- reading/converting measurements
--
-- Exactly like Section 16c: all five are the same "quiz" engine underneath
-- (question_text/options/correct_answer/points/time_limit_seconds, checked
-- by the existing check_quiz_answer RPC), just with different question_type
-- per round (`multiple_choice`, `true_false`, or `text`) and, for
-- logo_challenge, an optional image via the existing game_images path. No
-- schema changes needed beyond widening the game_type check constraint --
-- category and per-question images already exist from 16c.
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
    'measurement_challenge'
  ));
