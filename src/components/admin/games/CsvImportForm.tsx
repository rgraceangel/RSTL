"use client";

import { useRef, useState, useTransition } from "react";
import { AlertCircle, Download, FileUp, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CsvImportPreviewTable } from "@/components/admin/games/CsvImportPreviewTable";
import {
  previewImportQuestionsAction,
  confirmImportQuestionsAction,
  type CsvPreviewResult,
} from "@/lib/actions/game-questions";
import { QUESTIONS_CSV_TEMPLATE } from "@/constants";

export function CsvImportForm({ gameId }: { gameId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<CsvPreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, startParseTransition] = useTransition();
  const [isImporting, startImportTransition] = useTransition();

  const handleFile = async (file: File) => {
    setError(null);
    setPreview(null);
    setFileName(file.name);

    const text = await file.text();

    startParseTransition(async () => {
      const result = await previewImportQuestionsAction(gameId, text);
      if (result.error) {
        setError(result.error);
        return;
      }
      setPreview(result);
    });
  };

  const handleConfirm = () => {
    if (!preview) return;
    const validRows = preview.rows.filter((row) => row.isValid && row.data).map((row) => row.data!);
    if (validRows.length === 0) return;

    setError(null);
    startImportTransition(async () => {
      const result = await confirmImportQuestionsAction(gameId, validRows);
      if (result?.error) setError(result.error);
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob([QUESTIONS_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "questions-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold">1. Prepare your CSV</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Columns: <code className="rounded bg-muted px-1 py-0.5">question_text</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">question_type</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">options</code> (pipe-separated, e.g.{" "}
          <code className="rounded bg-muted px-1 py-0.5">Paris|London|Berlin</code>),{" "}
          <code className="rounded bg-muted px-1 py-0.5">correct_answer</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">explanation</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">points</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">time_limit_seconds</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">category</code> (optional -- only used by
          Name It to Win It).
        </p>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={downloadTemplate}>
          <Download className="h-4 w-4" />
          Download CSV template
        </Button>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">2. Upload &amp; preview</h3>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={isParsing}
          onClick={() => inputRef.current?.click()}
        >
          {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          {isParsing ? "Parsing…" : "Choose CSV file"}
        </Button>
        {fileName && <p className="mt-2 text-xs text-muted-foreground">Selected: {fileName}</p>}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {preview && (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">3. Review &amp; confirm</h3>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-emerald-700">{preview.validCount} valid</span>
              {preview.errorCount > 0 && (
                <>
                  {" "}
                  · <span className="font-medium text-red-600">{preview.errorCount} with errors</span>
                </>
              )}
            </p>
          </div>

          <CsvImportPreviewTable rows={preview.rows} />

          <Button
            type="button"
            className="gap-2"
            disabled={preview.validCount === 0 || isImporting}
            onClick={handleConfirm}
          >
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Im