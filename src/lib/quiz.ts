import type { Json } from "@/types";
import type { PublicQuizQuestion } from "@/lib/queries/play";

export interface QuizOption {
  id: string;
  text: string;
}

/**
 * `game_questions(_public).options` is stored as `Json` in the DB -- narrow
 * it defensively rather than trusting the shape blindly. Shared by
 * `QuizChallenge.tsx` (rendering the choices) and `GameEngine.tsx`
 * (mapping a revealed `correct_answer` id back to its display text), so
 * there is exactly one parser for this shape.
 */
export function parseQuizOptions(options: Json): QuizOption[] {
  if (!Array.isArray(options)) return [];
  return options.filter(
    (option): option is QuizOption =>
      typeof option === "object" &&
      option !== null &&
      !Array.isArray(option) &&
      typeof (option as Record<string, unknown>).id === "string" &&
      typeof (option as Record<string, unknown>).text === "string"
  );
}

/**
 * Turns a raw `correct_answer` value (an option id for multiple_choice,
 * the literal "true"/"false" for true_false, or free text for text
 * questions) into something human-readable for the "Reveal answer" stage.
 */
export function describeQuizAnswer(question: PublicQuizQuestion, rawCorrectAnswer: string): string {
  if (question.question_type === "multiple_choice") {
    const match = parseQuizOptions(question.options).find((option) => option.id === rawCorrectAnswer);
    return match?.text ?? rawCorrectAnswer;
  }
  if (question.question_type === "true_false") {
    return rawCorrectAnswer === "true" ? "True" : "False";
  }
  return rawCorrectAnswer;
}
