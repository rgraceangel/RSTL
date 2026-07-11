--------------------------------------------------------------------------------
-- Section 16f: five more player-facing game types --
--   'emoji_science'        -- decode a science concept from an emoji sequence
--   'picture_puzzle'        -- combine two pictured word-parts into a compound science term
--   'memory_challenge'      -- glance at a row of pictured items, then recall which one was NOT shown
--   'spot_the_difference'   -- compare two near-identical panels and identify what changed
--   'ppe_challenge'         -- name the personal protective equipment shown
--
-- Exactly like Section 16c/16d/16e: all five are the same "quiz" engine
-- underneath (question_text/options/correct_answer/points/
-- time_limit_seconds, checked by the existing check_quiz_answer RPC), just
-- with different question_type per round (`multiple_choice` or `text`) and,
-- where noted, an optional image via the existing game_images path. No
-- schema changes needed beyond widening the game_type check constraint --
-- category, per-question images, and the options/correct_answer shape all
-- already exist from 16c/16d/16e.
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
    'ppe_challenge'
  ));
