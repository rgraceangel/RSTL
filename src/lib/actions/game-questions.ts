"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { getGameById, getNextQuestionOrderIndex } from "@/lib/queries/games";
import { parseCsv, csvRowsToObjects } from "@/lib/csv";
import {
  gameQuestionSchema,
  csvRowToQuestionCandidate,
  type GameQuestionFormValues,
} from "@/lib/validations/game-question";

export interface ActionResult {
  error?: string;
}

const MANAGE_ROLES = ["admin", "super_admin"] as const;

async function syncQuestionImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  gameId: string,
  questionId: string,
  imageUrl: string
) {
  const { data: existing } = await supabase
    .from("game_images")
    .select("id")
    .eq("question_id", questionId)
    .maybeSingle();

  if (!imageUrl) {
    if (existing) {
      await supabase.from("game_images").delete().eq("id", existing.id);
    }
    return;
  }

  if (existing) {
    await supabase.from("game_images").update({ image_url: imageUrl }).eq("id", existing.id);
  } else {
    await supabase.from("game_images").insert({
      game_id: gameId,
      question_id: questionId,
      image_url: imageUrl,
      image_type: "question",
    });
  }
}

export async function createQuestionAction(
  gameId: string,
  values: GameQuestionFormValues
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = gameQuestionSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();
  const orderIndex = await getNextQuestionOrderIndex(gameId);

  const { data: question, error } = await supabase
    .from("game_questions")
    .insert({
      game_id: gameId,
      question_text: parsed.data.question_text,
      question_type: parsed.data.question_type,
      options: parsed.data.options,
      correct_answer: parsed.data.correct_answer,
      explanation: parsed.data.explanation || null,
      points: parsed.data.points,
      time_limit_seconds: parsed.data.time_limit_seconds,
      category: parsed.data.category || null,
      order_index: orderIndex,
    })
    .select("id")
    .single();

  if (error || !question) {
    return { error: "Could not create the question. Please try again." };
  }

  if (parsed.data.image_url) {
    await syncQuestionImage(supabase, gameId, question.id, parsed.data.image_url);
  }

  revalidatePath(`/admin/games/${gameId}/questions`);
  redirect(`/admin/games/${gameId}/questions`);
}

export async function updateQuestionAction(
  gameId: string,
  questionId: string,
  values: GameQuestionFormValues
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const parsed = gameQuestionSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Check the highlighted fields and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("game_questions")
    .update({
      question_text: parsed.data.question_text,
      question_type: parsed.data.question_type,
      options: parsed.data.options,
      correct_answer: parsed.data.correct_answer,
      explanation: parsed.data.explanation || null,
      points: parsed.data.points,
      time_limit_seconds: parsed.data.time_limit_seconds,
      category: parsed.data.category || null,
    })
    .eq("id", questionId);

  if (error) {
    return { error: "Could not update the question. Please try again." };
  }

  await syncQuestionImage(supabase, gameId, questionId, parsed.data.image_url ?? "");

  revalidatePath(`/admin/games/${gameId}/questions`);
  revalidatePath(`/admin/games/${gameId}/questions/${questionId}`);
  redirect(`/admin/games/${gameId}/questions`);
}

export async function deleteQuestionAction(gameId: string, questionId: string): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.from("game_questions").delete().eq("id", questionId);

  if (error) {
    return { error: "Could not delete this question." };
  }

  revalidatePath(`/admin/games/${gameId}/questions`);
  return {};
}

export async function moveQuestionAction(
  gameId: string,
  questionId: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase.rpc("move_game_question", {
    p_question_id: questionId,
    p_direction: direction,
  });

  if (error) {
    return { error: "Could not reorder this question." };
  }

  revalidatePath(`/admin/games/${gameId}/questions`);
  return {};
}

export interface CsvPreviewRow {
  lineNumber: number;
  isValid: boolean;
  error: string | null;
  preview: {
    question_text: string;
    question_type: string;
    correct_answer: string;
    points: number;
    time_limit_seconds: number;
    category: string;
  };
  data: GameQuestionFormValues | null;
}

export interface CsvPreviewResult {
  rows: CsvPreviewRow[];
  validCount: number;
  errorCount: number;
  error?: string;
}

/** Parses + validates a CSV file's text without inserting anything yet. */
export async function previewImportQuestionsAction(
  gameId: string,
  csvText: string
): Promise<CsvPreviewResult> {
  await requireRole([...MANAGE_ROLES]);

  const game = await getGameById(gameId);
  const config = (game?.config ?? {}) as Record<string, unknown>;
  const defaultTimeLimit =
    typeof config.default_time_limit_seconds === "number" ? config.default_time_limit_seconds : 30;

  let parsedRows: Record<string, string>[];
  try {
    parsedRows = csvRowsToObjects(parseCsv(csvText));
  } catch {
    return { rows: [], validCount: 0, errorCount: 0, error: "Could not parse this file as CSV." };
  }

  if (parsedRows.length === 0) {
    return { rows: [], validCount: 0, errorCount: 0, error: "No data rows found in this CSV." };
  }

  const rows: CsvPreviewRow[] = parsedRows.map((row, index) => {
    const candidate = csvRowToQuestionCandidate(row, defaultTimeLimit);
    const parsed = gameQuestionSchema.safeParse(candidate);

    const candidateRecord = candidate as Record<string, unknown>;

    return {
      lineNumber: index + 2, // +1 for 0-index, +1 for the header row
      isValid: parsed.success,
      error: parsed.success ? null : parsed.error.issues[0]?.message ?? "Invalid row",
      preview: {
        question_text: String(candidateRecord.question_text ?? ""),
        question_type: String(candidateRecord.question_type ?? ""),
        correct_answer: String(candidateRecord.correct_answer ?? ""),
        points: Number(candidateRecord.points ?? 0),
        time_limit_seconds: Number(candidateRecord.time_limit_seconds ?? 0),
        category: String(candidateRecord.category ?? ""),
      },
      data: parsed.success ? parsed.data : null,
    };
  });

  return {
    rows,
    validCount: rows.filter((r) => r.isValid).length,
    errorCount: rows.filter((r) => !r.isValid).length,
  };
}

/** Inserts the rows the admin confirmed after reviewing the CSV preview. */
export async function confirmImportQuestionsAction(
  gameId: string,
  rows: GameQuestionFormValues[]
): Promise<ActionResult> {
  await requireRole([...MANAGE_ROLES]);

  if (rows.length === 0) {
    return { error: "No valid rows to import." };
  }

  const revalidated = rows.map((row) => gameQuestionSchema.safeParse(row));
  if (revalidated.some((r) => !r.success)) {
    return { error: "One or more rows failed validation. Please re-run the preview." };
  }

  const supabase = await createClient();
  const startingOrderIndex = await getNextQuestionOrderIndex(gameId);

  const inserts = rows.map((row, index) => ({
    game_id: gameId,
    question_text: row.question_text,
    question_type: row.question_type,
    options: row.options,
    correct_answer: row.correct_answer,
    explanation: row.explanation || null,
    points: row.points,
    time_limit_seconds: row.time_limit_seconds,
    category: row.category || null,
    order_index: startingOrderIndex + index,
  }));

  const { error } = await supabase.from("game_questions").insert(inserts);

  if (error) {
    return { error: "Could not import these questions. Please try again." };
  }

  revalidatePath(`/admin/games/${gameId}/questions`);
  redirect(`/admin/games/${gameId}/questions`);
}
