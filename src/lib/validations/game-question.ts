import { z } from "zod";

export const QUESTION_TYPES = ["multiple_choice", "true_false", "text"] as const;

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, "Option text is required").max(300),
});

export type QuestionOption = z.infer<typeof questionOptionSchema>;

export const gameQuestionSchema = z
  .object({
    question_text: z.string().min(2, "Must be at least 2 characters").max(2000),
    question_type: z.enum(QUESTION_TYPES),
    options: z.array(questionOptionSchema).default([]),
    correct_answer: z.string().min(1, "Correct answer is required").max(300),
    explanation: z.string().max(2000).optional().or(z.literal("")),
    points: z.coerce.number().int().min(0, "Must be 0 or more"),
    time_limit_seconds: z.coerce.number().int().min(5, "Must be at least 5 seconds"),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    category: z.string().max(120).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.question_type === "multiple_choice") {
      if (data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Add at least 2 options",
          path: ["options"],
        });
      }
      if (!data.options.some((option) => option.id === data.correct_answer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Correct answer must match one of the options",
          path: ["correct_answer"],
        });
      }
    }

    if (data.question_type === "true_false") {
      const normalized = data.correct_answer.trim().toLowerCase();
      if (normalized !== "true" && normalized !== "false") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Correct answer must be "true" or "false"',
          path: ["correct_answer"],
        });
      }
    }
  });

export type GameQuestionFormValues = z.infer<typeof gameQuestionSchema>;

/**
 * Turns one parsed CSV row into the same shape `gameQuestionSchema`
 * expects, so bulk-imported questions are validated by the exact same
 * rules as a manually-entered question -- no parallel validation logic.
 *
 * Expected CSV columns: question_text, question_type, options,
 * correct_answer, explanation, points, time_limit_seconds, category
 * (category is optional and only meaningful for image-driven types like
 * name_it_to_win_it -- image_url isn't a CSV column since bulk-importing
 * images by URL isn't supported; add each question's image afterwards via
 * the per-question ImageUpload in the question form).
 * `options` is pipe-separated ("Paris|London|Berlin"); for multiple_choice
 * rows, `correct_answer` is matched against option *text* (case-insensitive)
 * and resolved to the generated option id.
 */
export function csvRowToQuestionCandidate(
  row: Record<string, string>,
  defaultTimeLimitSeconds: number
): unknown {
  const rawType = row.question_type?.trim().toLowerCase();
  const question_type = (QUESTION_TYPES as readonly string[]).includes(rawType)
    ? (rawType as (typeof QUESTION_TYPES)[number])
    : "multiple_choice";

  const options =
    question_type === "multiple_choice"
      ? (row.options ?? "")
          .split("|")
          .map((text) => text.trim())
          .filter((text) => text.length > 0)
          .map((text) => ({ id: crypto.randomUUID(), text }))
      : [];

  let correct_answer = (row.correct_answer ?? "").trim();
  if (question_type === "multiple_choice") {
    const match = options.find((option) => option.text.toLowerCase() === correct_answer.toLowerCase());
    correct_answer = match ? match.id : correct_answer;
  } else if (question_type === "true_false") {
    correct_answer = correct_answer.toLowerCase();
  }

  const points = Number.parseInt(row.points ?? "", 10);
  const timeLimit = Number.parseInt(row.time_limit_seconds ?? "", 10);

  return {
    question_text: row.question_text ?? "",
    question_type,
    options,
    correct_answer,
    explanation: row.explanation ?? "",
    points: Number.isFinite(points) ? points : 10,
    time_limit_seconds: Number.isFinite(timeLimit) ? timeLimit : defaultTimeLimitSeconds,
    image_url: "",
    category: (row.category ?? "").trim(),
  };
}
