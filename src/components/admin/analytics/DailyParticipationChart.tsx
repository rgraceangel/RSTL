"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { DailyParticipationRow } from "@/lib/queries/analytics";

const AXIS_COLOR = "hsl(var(--muted-foreground))";
const GRID_COLOR = "hsl(var(--border))";

function formatDayLabel(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Trailing-N-day time series (default 30, from `get_daily_participation`,
 * already zero-filled for days with no activity by the RPC itself). Two
 * overlaid areas -- total sessions started and prizes won -- share one axis
 * so the relationship between traffic and conversion is visible at a
 * glance.
 */
export function DailyParticipationChart({ data }: { data: DailyParticipationRow[] }) {
  const totalActivity = data.reduce((sum, row) => sum + row.sessionsCount, 0);

  if (totalActivity === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        No sessions recorded yet in this window.
      </div>
    );
  }

  const chartData = data.map((row) => ({
    day: formatDayLabel(row.day),
    Sessions: row.sessionsCount,
    Winners: row.winnersCount,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="analyticsSessionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="analyticsWinnersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey="day" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke={AXIS_COLOR}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="Sessions"
            stroke="#2563eb"
            fill="url(#analyticsSessionsFill)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Winners"
            stroke="#d97706"
            fill="url(#analyticsWinnersFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
