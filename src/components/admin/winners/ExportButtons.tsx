"use client";

import { useSearchParams } from "next/navigation";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const linkButtonClass = cn(
  "inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-muted"
);

export function ExportButtons() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <a href={`/admin/winners/export/csv${query ? `?${query}` : ""}`} className={linkButtonClass}>
        <FileText className="h-4 w-4" />
        Export CSV
      </a>
      <a href={`/admin/winners/export/xlsx${query ? `?${query}` : ""}`} className={linkButtonClass}>
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </a>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
