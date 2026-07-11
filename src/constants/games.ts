import type { GameType, GameStatus } from "@/types";
import type { QuestionOption } from "@/lib/validations/game-question";

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  quiz: "Quiz",
  spin_wheel: "Spin Wheel",
  claw_machine: "Claw Machine",
  scratch_card: "Scratch Card",
  slot_machine: "Slot Machine",
  decoder: "Decoder",
  guess_the_gibberish: "Guess the Gibberish",
  name_it_to_win_it: "Name It to Win It",
  logo_challenge: "Logo Challenge",
  chemical_symbol_challenge: "Chemical Symbol Challenge",
  true_or_false: "True or False",
  guess_the_unit: "Guess the Unit",
  measurement_challenge: "Measurement Challenge",
  equipment_match: "Equipment Match",
  which_laboratory: "Which Laboratory",
  hazard_symbol: "Hazard Symbol",
  odd_one_out: "Odd One Out",
  word_scramble: "Word Scramble",
  emoji_science: "Emoji Science",
  picture_puzzle: "Picture Puzzle",
  memory_challenge: "Memory Challenge",
  spot_the_difference: "Spot the Difference",
  ppe_challenge: "PPE Challenge",
  calibration_challenge: "Calibration Challenge",
  science_bingo: "Science Bingo",
  science_facts: "Science Facts",
  mini_crossword: "Mini Crossword",
  wheel_of_science_facts: "Wheel of Science Facts",
};

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};

export const GAME_STATUS_STYLES: Record<GameStatus, string> = {
  draft: "bg-secondary text-secondary-foreground",
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  archived: "bg-red-50 text-red-600",
};

export const QUESTION_TYPE_LABELS: Record<"multiple_choice" | "true_false" | "text", string> = {
  multiple_choice: "Multiple Choice",
  true_false: "True / False",
  text: "Text Answer",
};

export const GAMES_PAGE_SIZE = 10;

export const GAME_IMAGE_TYPES = ["banner", "thumbnail", "background", "icon"] as const;

export const GAME_IMAGE_TYPE_LABELS: Record<(typeof GAME_IMAGE_TYPES)[number], string> = {
  banner: "Banner",
  thumbnail: "Thumbnail",
  background: "Background",
  icon: "Icon",
};

/**
 * Header row + example rows for the "download CSV template" button.
 * `category` is optional and only meaningful for `name_it_to_win_it`
 * (groups images into a category like "GHS Hazard Symbols"); leave it
 * blank for quiz/decoder/guess_the_gibberish rows.
 */
export const QUESTIONS_CSV_TEMPLATE = [
  "question_text,question_type,options,correct_answer,explanation,points,time_limit_seconds,category",
  '"What is the capital of France?",multiple_choice,"Paris|London|Berlin|Madrid",Paris,"Paris has been the capital since 987 AD.",10,30,',
  '"The Great Wall of China is visible from space.",true_false,,false,"A common myth -- it is not visible to the naked eye from orbit.",10,20,',
  '"Decode the image!",text,,My Life,"Remove the numbers to reveal the phrase.",10,20,',
  '"See Live Bell",text,,Syllable,,10,20,',
  '"Name what\'s pictured!",text,,Bunsen Burner,,10,10,Laboratory Equipment',
].join("\r\n");

/**
 * Suggested categories for `name_it_to_win_it` images, per the content
 * brief -- shown as datalist suggestions in the question form, but the
 * `category` field stays free text so an admin isn't locked to this list.
 */
export const NAME_IT_TO_WIN_IT_CATEGORIES = [
  "Laboratory Equipment",
  "Calibration Equipment",
  "Chemical Laboratory Apparatus",
  "Microbiology Laboratory Equipment",
  "Furniture Testing Equipment",
  "Shelf-Life Testing Equipment",
  "Physical Testing Equipment",
  "Laboratory Safety Equipment",
  "Chemical Symbols",
  "GHS Hazard Symbols",
  "SI Units and Measurement Symbols",
  "Philippine Government Science and Regulatory Agency Logos",
] as const;

export function buildDefaultQuestionOptions(): QuestionOption[] {
  return [
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ];
}

/**
 * Default "Mechanics" copy shown by `GameIntro.tsx` (Section
 * 16b/16c/16d/16e/16f/16g's Game Engine) when a game has no admin-authored
 * `description`. Twenty-five of twenty-eight `game_type`s are actually
 * playable: `quiz`, `spin_wheel`, `decoder`, `guess_the_gibberish`,
 * `name_it_to_win_it`, `logo_challenge`, `chemical_symbol_challenge`,
 * `true_or_false`, `guess_the_unit`, `measurement_challenge`,
 * `equipment_match`, `which_laboratory`, `hazard_symbol`, `odd_one_out`,
 * `word_scramble`, `emoji_science`, `picture_puzzle`, `memory_challenge`,
 * `spot_the_difference`, `ppe_challenge`, `calibration_challenge`,
 * `science_bingo`, `science_facts`, `mini_crossword`, and
 * `wheel_of_science_facts`. `claw_machine`/`scratch_card`/`slot_machine`
 * still get honest copy rather than a blank gap, in case a `draft` game of
 * that type were ever flipped to `active` before its engine exists.
 */
export const GAME_TYPE_MECHANICS_COPY: Record<GameType, string> = {
  quiz: "You'll get one random question and a countdown timer. Answer correctly before time runs out to earn a spin on the Prize Wheel.",
  spin_wheel: "Spin the wheel for an instant shot at a real prize from the current catalog.",
  decoder: "You'll see a picture puzzle -- figure out the word or phrase it's hiding before the countdown runs out.",
  guess_the_gibberish: "You'll see a phrase that sounds like something else when read aloud. Say it out loud and type what it really means before time runs out.",
  name_it_to_win_it: "You'll see a random image for a few seconds -- name what it is before the countdown ends.",
  logo_challenge: "You'll see a logo -- name the brand or organization before the countdown ends.",
  chemical_symbol_challenge: "You'll see a chemical symbol -- name the element it stands for before time runs out.",
  true_or_false: "You'll get one true-or-false statement and a countdown timer. Call it correctly to earn a spin on the Prize Wheel.",
  guess_the_unit: "You'll be asked what a quantity is measured in -- name the correct unit before the countdown ends.",
  measurement_challenge: "You'll get a real-world measurement or reading to work out or convert -- answer before time runs out.",
  equipment_match: "You'll be asked what a piece of equipment is used for -- pick the right match before the countdown ends.",
  which_laboratory: "You'll get a test or procedure -- pick the type of laboratory that runs it before time runs out.",
  hazard_symbol: "You'll see a hazard symbol -- name the hazard class it represents before the countdown ends.",
  odd_one_out: "You'll see four items -- pick the one that doesn't belong before time runs out.",
  word_scramble: "You'll see a scrambled science term -- unscramble it before the countdown ends.",
  emoji_science: "You'll see a sequence of emoji -- name the science concept they represent before time runs out.",
  picture_puzzle: "You'll see two pictures side by side -- combine them into one science term before the countdown ends.",
  memory_challenge: "You'll see a row of pictured items -- remember them, then pick the one that was NOT shown before time runs out.",
  spot_the_difference: "You'll see two nearly-identical images -- spot what's different between them before the countdown ends.",
  ppe_challenge: "You'll see a piece of protective equipment -- name it before time runs out.",
  calibration_challenge: "You'll get a calibration or metrology question -- work it out or call it true or false before time runs out.",
  science_bingo: "You'll get a bingo call -- match the clue to the right science term before the countdown ends.",
  science_facts: "You'll get a science fact with a blank -- fill it in before time runs out.",
  mini_crossword: "You'll get one crossword-style clue with a letter count -- solve it before the countdown ends.",
  wheel_of_science_facts: "You'll get a \"did you know\" science fact -- call it true or false before time runs out.",
  claw_machine: "This game type doesn't have a player experience built yet -- check back soon.",
  scratch_card: "This game type doesn't have a player experience built yet -- check back soon.",
  slot_machine: "This game type doesn't have a player experience built yet -- check back soon.",
};
