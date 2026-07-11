import "server-only";

import { createClient } from "@/lib/supabase/server";
import { GAMES_PAGE_SIZE } from "@/constants";
import type { GameType, GameStatus, QuestionType, ImageType, Json } from "@/types";

export interface GameListItem {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  game_type: GameType;
  status: GameStatus;
  question_count: number;
  image_count: number;
}

export interface ListGamesResult {
  games: GameListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export async function listGames({
  search = "",
  status = "all",
  page = 1,
  pageSize = GAMES_PAGE_SIZE,
}: {
  search?: string;
  status?: GameStatus | "all";
  page?: number;
  pageSize?: number;
}): Promise<ListGamesResult> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("games")
    .select("id, name, slug, thumbnail_url, game_type, status", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data: gameRows, count } = await query;
  const games = gameRows ?? [];
  const gameIds = games.map((g) => g.id);

  let questionCountByGame = new Map<string, number>();
  let imageCountByGame = new Map<string, number>();

  if (gameIds.length > 0) {
    const [questionsRes, imagesRes] = await Promise.all([
      supabase.from("game_questions").select("game_id").in("game_id", gameIds),
      supabase.from("game_images").select("game_id").in("game_id", gameIds),
    ]);

    questionCountByGame = (questionsRes.data ?? []).reduce((map, row) => {
      map.set(row.game_id, (map.get(row.game_id) ?? 0) + 1);
      return map;
    }, new Map<string, number>());

    imageCountByGame = (imagesRes.data ?? []).reduce((map, row) => {
      map.set(row.game_id, (map.get(row.game_id) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
  }

  const merged: GameListItem[] = games.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    thumbnail_url: g.thumbnail_url,
    game_type: g.game_type,
    status: g.status,
    question_count: questionCountByGame.get(g.id) ?? 0,
    image_count: imageCountByGame.get(g.id) ?? 0,
  }));

  const total = count ?? 0;

  return {
    games: merged,
    total,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export interface GameDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  game_type: GameType;
  status: GameStatus;
  thumbnail_url: string | null;
  max_attempts_per_user: number;
  config: Json;
  start_date: string | null;
  end_date: string | null;
}

export async function getGameById(id: string): Promise<GameDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getGameBySlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("games").select("id").eq("slug", slug).limit(1);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data } = await query;
  return (data ?? []).length > 0;
}

export interface GameQuestionListItem {
  id: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  time_limit_seconds: number;
  order_index: number;
  category: string | null;
  has_image: boolean;
}

export async function listGameQuestions(gameId: string): Promise<GameQuestionListItem[]> {
  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("game_questions")
    .select("id, question_text, question_type, points, time_limit_seconds, order_index, category")
    .eq("game_id", gameId)
    .order("order_index", { ascending: true });

  const rows = questions ?? [];
  if (rows.length === 0) return [];

  const { data: images } = await supabase
    .from("game_images")
    .select("question_id")
    .eq("game_id", gameId)
    .not("question_id", "is", null);

  const questionIdsWithImages = new Set((images ?? []).map((i) => i.question_id));

  return rows.map((q) => ({
    ...q,
    has_image: questionIdsWithImages.has(q.id),
  }));
}

export interface GameQuestionDetail {
  id: string;
  game_id: string;
  question_text: string;
  question_type: QuestionType;
  options: Json;
  correct_answer: string;
  explanation: string | null;
  points: number;
  order_index: number;
  time_limit_seconds: number;
  category: string | null;
  image_url: string | null;
  image_id: string | null;
}

export async function getGameQuestionById(id: string): Promise<GameQuestionDetail | null> {
  const supabase = await createClient();
  const { data: question } = await supabase.from("game_questions").select("*").eq("id", id).maybeSingle();
  if (!question) return null;

  const { data: image } = await supabase
    .from("game_images")
    .select("id, image_url")
    .eq("question_id", id)
    .maybeSingle();

  return {
    ...question,
    image_url: image?.image_url ?? null,
    image_id: image?.id ?? null,
  };
}

export async function getNextQuestionOrderIndex(gameId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_questions")
    .select("order_index")
    .eq("game_id", gameId)
    .order("order_index", { ascending: false })
    .limit(1);

  const highest = data?.[0]?.order_index;
  return typeof highest === "number" ? highest + 1 : 0;
}

export interface GameImageItem {
  id: string;
  image_url: string;
  image_type: ImageType;
  alt_text: string | null;
  display_order: number;
}

export async function listGameLevelImages(gameId: string): Promise<GameImageItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_images")
    .select("id, image_url, image_type, alt_text, display_order")
    .eq("game_id", gameId)
    .is("question_id", null)
    .order("display_order", { ascending: true });

  return data ?? [];
}

/** Full question set for a game, ordered -- used by the read-only preview. */
export interface GameQuestionWithImage extends GameQuestionDetail {}

export async function listGameQuestionsForPreview(gameId: string): Promise<GameQuestionWithImage[]> {
  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("game_questions")
    .select("*")
    .eq("game_id", gameId)
    .order("order_index", { ascending: true });

  const rows = questions ?? [];
  if (rows.length === 0) return [];

  const { data: images } = await supabase
    .from("game_images")
    .select("id, image_url, question_id")
    .eq("game_id", gameId)
    .not("question_id", "is", null);

  const imageByQuestion = new Map((images ?? []).map((img) => [img.question_id as string, img]));

  return rows.map((q) => {
    const image = imageByQuestion.get(q.id);
    return {
      ...q,
      image_url: image?.image_url ?? null,
      image_id: image?.id ?? null,
    };
  });
}
