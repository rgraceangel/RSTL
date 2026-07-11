"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { WHEEL_COLORS } from "@/constants";
import type { PopularGameRow } from "@/lib/queries/analytics";

/**
 * Horizontal ranking of every game by total sessions played
 * (`get_most_popular_games`), capped to the top 8 so the chart stays
 * readable once the catalog grows past a couple dozen games. Reuses
 * `WHEEL_COLORS` (the same palette cycling through the public homepage's
 * wheels) purely for visual consistency across the app, not any semantic
 * meaning.
 */
export function PopularGamesChart({ games }: { games: PopularGameRow[] }) {
  const top = games.filter((game) => game.sessionsCount > 0).slice(0, 8);

  if (top.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No games have been played yet.
      </div>
    );
  }

  const chartData = top.map((game) => ({ name: game.gameName, Sessions: game.sessionsCount }));
  const height = Math.max(220, top.length * 40);

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            width={140}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="Sessions" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={WHEEL_COLORS[index % WHEEL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
