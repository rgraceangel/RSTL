"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  gameQuestionSchema,
  QUESTION_TYPES,
  type GameQuestionFormValues,
  type QuestionOption,
} from "@/lib/validations/game-question";
import { QUESTION_TYPE_LABELS, buildDefaultQuestionOptions, NAME_IT_TO_WIN_IT_CATEGORIES } from "@/constants";
import type { GameQuestionDetail } from "@/lib/queries/games";

interface QuestionFormProps {
  question?: GameQuestionDetail;
  defaultTimeLimitSeconds: number;
  onSubmit: (values: GameQuestionFormValues) => Promise<{ error?: string } | void>;
}

export function QuestionForm({ question, defaultTimeLimitSeconds, onSubmit }: QuestionFormProps) {
  const isEditing = !!question;
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const initialOptions: QuestionOption[] =
    question && Array.isArray(question.options) && question.options.length > 0
      ? (question.options as unknown as QuestionOption[])
      : buildDefaultQuestionOptions();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<GameQuestionFormValues>({
    resolver: zodResolver(gameQuestionSchema),
    defaultValues: {
      question_text: question?.question_text ?? "",
      question_type: question?.question_type ?? "multiple_choice",
      options: initialOptions,
      correct_answer: question?.correct_answer ?? "",
      explanation: question?.explanation ?? "",
      points: question?.points ?? 10,
      time_limit_seconds: question?.time_limit_seconds ?? defaultTimeLimitSeconds,
      image_url: question?.image_url ?? "",
      category: question?.category ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const questionType = watch("question_type");
  const options = watch("options");

  useEffect(() => {
    if (questionType === "multiple_choice" && getValues("options").length === 0) {
      setValue("options", buildDefaultQuestionOptions());
    }
  }, [questionType, getValues, setValue]);

  const submit = (values: GameQuestionFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const payload = values.question_type === "multiple_choice" ? values : { ...values, options: [] };
      const result = await onSubmit(payload);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-6" noValidate>
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="question_text">Question</Label>
        <Textarea
          id="question_text"
          rows={3}
          disabled={isPending}
          aria-invalid={!!errors.question_text}
          {...register("question_text")}
        />
        {errors.question_text && (
          <p className="text-xs text-red-600">{errors.question_text.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Image (optional)</Label>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? ""}
              onChange={field.onChange}
              bucket="game-images"
              alt="Question"
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category (optional)</Label>
        <Input
          id="category"
          list="question-category-suggestions"
          placeholder="e.g. Laboratory Equipment"
          disabled={isPending}
          {...register("category")}
        />
        <datalist id="question-category-suggestions">
          {NAME_IT_TO_WIN_IT_CATEGORIES.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <p className="text-xs text-muted-foreground">
          Used to group images for Name It to Win It; leave blank for other game types.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="question_type">Question type</Label>
        <Select id="question_type" disabled={isPending} {...register("question_type")}>
          {QUESTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {QUESTION_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      </div>

      {questionType === "multiple_choice" && (
        <div className="space-y-2">
          <Label>Options</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                disabled={isPending}
                placeholder={`Option ${index + 1}`}
                {...register(`options.${index}.text` as const)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={isPending || fields.length <= 2}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Remove option"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {errors.options && (
            <p className="text-xs text-red-600">
              {(errors.options as { message?: string }).message ?? "Check the options above."}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={isPending}
            onClick={() => append({ id: crypto.randomUUID(), text: "" })}
          >
            <Plus className="h-3.5 w-3.5" />
            Add option
          </Button>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="correct_answer">Correct answer</Label>
        {questionType === "multiple_choice" ? (
          <Select
            id="correct_answer"
            disabled={isPending}
            aria-invalid={!!errors.correct_answer}
            {...register("correct_answer")}
          >
            <option value="">Select the correct option…</option>
            {options.map((option, index) => (
              <option key={option.id} value={option.id}>
                {option.text || `Option ${index + 1}`}
              </option>
            ))}
          </Select>
        ) : questionType === "true_false" ? (
          <Select
            id="correct_answer"
            disabled={isPending}
            aria-invalid={!!errors.correct_answer}
            {...register("correct_answer")}
          >
            <option value="">Select…</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </Select>
        ) : (
          <Input
            id="correct_answer"
            disabled={isPending}
            aria-invalid={!!errors.correct_answer}
            {...register("correct_answer")}
          />
        )}
        {errors.correct_answer && (
          <p className="text-xs text-red-600">{errors.correct_answer.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explanation">Explanation (optional)</Label>
        <Textarea id="explanation" rows={2} disabled={isPending} {...register("explanation")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            min="0"
            step="1"
            disabled={isPending}
            aria-invalid={!!errors.points}
            {...register("points")}
          />
          {errors.points && <p className="text-xs text-red-600">{errors.points.message}</p>}
        </div>
        <div className="space-y-1.5">
          