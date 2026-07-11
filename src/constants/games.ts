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

export const GAME_IMAGE_TYPES = ["banner", "thumbnail", "