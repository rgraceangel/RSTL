import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CsvPreviewRow } from "@/lib/actions/game-questions";

export function CsvImportPreviewTable({ rows }: { rows: CsvPreviewRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2 font-medium">Line</th>
            <th className="px-3 py-2 font-medium">Question</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Correct answer</th>
            <th className="px-3 py-2 font-medium">Points</th>
            <th className="px-3 py-2 font-medium">Timer</th>
            <th className="px-3 py-2 font-medium">Category</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.lineNumber} className={cn(!row.isValid && "bg-red-50/60")}>
              <td className="px-3 py-2 text-muted-foreground">{row.lineNumber}</td>
              <td className="max-w-xs truncate px-3 py-2">{row.preview.question_text}</td>
              <td className="px-3 py-2 text-muted-foreground">{row.preview.question_type}</td>
              <td className="max-w-[10rem] truncate px-3 py-2 text-muted-foreground">
                {row.preview.correct_answer}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{row.preview.points}</td>
              <td className="px-3 py-2 text-muted-foreground">{row.preview.time_limit_seconds}s</td>
              <td className="max-w-[8rem] truncate px-3 py-2 text-muted-foreground">
                {row.preview.category || "—"}
              </td>
              <td className="px-3 py-2">
                {row.isValid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600" title={row.error ?? ""}>
                  