"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { AnswerAccuracySummary } from "@/lib/queries/analytics";

const CORRECT_COLOR = "#059669";
const INCORRECT_COLOR = "#dc2626";

/**
 * Correct vs incorrect donut for every question-based challenge ever
 * answered (`game_sessions.answer_correct`, Section 17). Games with no
 * challenge stage (`spin_wheel`) never set this column, so they're
 * correctly excluded rather than silently counted as either outcome.
 */
export function AnswerAccuracyChart({ summary }: { summary: AnswerAccuracySummary }) {
  const total = summary.correctAnswers + summary.incorrectAnswers;

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No question-based challenges answered yet.
      </div>
    );
  }

  const data = [
    { name: "Correct", value: summary.correctAnswers, color: CORRECT_COLOR },
    { name: "Incorrect", value: summary.incorrectAnswers, color: INCORRECT_COLOR },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
