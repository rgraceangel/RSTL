--------------------------------------------------------------------------------
-- Section 16e: five more player-facing game types --
--   'equipment_match'   -- multiple-choice: match lab equipment to its function
--   'which_laboratory'  -- multiple-choice: match a test/procedure to the lab type that runs it
--   'hazard_symbol'      -- name the hazard class shown by a (sample) safety icon
--   'odd_one_out'        -- multiple-choice: pick the item that doesn't belong in a set
--   'word_scramble'      -- unscramble a science term (free-text answer)
--
-- Exactly like Section 16c/16d: all five are the same "quiz" engine underneath
-- (question_text/options/correct_answer/points/time_limit_seconds, checked by
-- the existing check_quiz_answer RPC), just with different question_type per
-- round (`multiple_choice` or `text`) and, for hazard_symbol, an optional
-- image via the existing game_images path. No schema changes needed beyond
-- widening the game_type check constraint -- category, per-question images,
-- and the options/correct_answer shape all already exist from 16c/16d.
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
    'word_scramble'
  ));
