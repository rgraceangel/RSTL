import Image from "next/image";
import { CheckCircle2, Clock, ImageOff, Star } from "lucide-react";
import { GAME_STATUS_LABELS, GAME_STATUS_STYLES, GAME_TYPE_LABELS, QUESTION_TYPE_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import type { GameDetail, GameQuestionWithImage } from "@/lib/queries/games";
import type { QuestionOption } from "@/lib/validations/game-question";

interface GamePreviewProps {
  game: GameDetail;
  questions: GameQuestionWithImage[];
}

/**
 * Read-only, admin-facing preview of a game and its full question set --
 * lets an admin sanity-check content (including correct answers) before
 * flipping a game to Active. This is not the player-facing game engine
 * (Phase 12); it's a review tool.
 */
export function GamePreview({ game, questions }: GamePreviewProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="overflow-hidden rounded-lg border border-border">
        {game.thumbnail_url ? (
          <div className="relative h-48 w-full bg-muted">
            <Image src={game.thumbnail_url} alt={game.name} fill className="object-cover" sizes="768px" />
          </div>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-muted">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{game.name}</h2>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                GAME_STATUS_STYLES[game.status]
              )}
            >
              {GAME_STATUS_LABELS[game.status]}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {GAME_TYPE_LABELS[game.game_type]}
            </span>
          </div>
          {game.description && <p className="text-sm text-muted-foreground">{game.description}</p>}
          <p className="text-xs text-muted-foreground">
            {questions.length} question{questions.length === 1 ? "" : "s"} · max{" "}
            {game.max_attempts_per_user} attempt{game.max_attempts_per_user === 1 ? "" : "s"} per player
          </p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
          This game has no questions yet.
        </div>
      ) : (
        <ol className="space-y-4">
          {questions.map((question, index) => {
            const options = Array.isArray(question.options)
              ? (question.options as unknown as QuestionOption[])
              : [];

            return (
              <li key={question.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Question {index + 1} · {QUESTION_TYPE_LABELS[question.question_type]}
                    {question.category && <> · {question.category}</>}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {question.points} pts
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {question.time_limit_seconds}s
                    </span>
                  </div>
                </div>

                <p className="mb-3 text-sm font-medium">{question.question_text}</p>

                {question.image_url && (
                  <div className="relative mb-3 h-40 w-full overflow-hidden rounded-md border border-border bg-muted">
                    <Image
                      src={question.image_url}
                      alt={`Question ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="768px"
                    />
                  </div>
                )}

                {question.question_type === "multiple_choice" && (
                  <ul className="space-y-1.5">
                    {options.map((option) => {
                      const isCorrect = option.id === question.correct_answer;
                      return (
                        <li
                          key={option.id}
                          className={cn(
                            "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
                            isCorrect
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-border"
                          )}
                        >
                          {isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                          {option.text}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {question.question_type === "true_false" && (
                  <p className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Correct answer: {question.correct_answer === "true" ? "True" : "False"}
                  </p>
                )}

                {question.question_type === "text" && (
                  <p className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Expected answer: {question.correct_answer}
                  </p>
                )}

                {question.explanation && (
                  <p className="mt-3 text-xs text-muted-foreground">{question.explanation}</p>
                )}
              </li