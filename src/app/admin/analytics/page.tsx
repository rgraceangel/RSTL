import type { Metadata } from "next";
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  Gift,
  Clock,
  Flame,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/analytics/ChartCard";
import { DailyParticipationChart } from "@/components/admin/analytics/DailyParticipationChart";
import { AnswerAccuracyChart } from "@/components/admin/analytics/AnswerAccuracyChart";
import { PopularGamesChart } from "@/components/admin/analytics/PopularGamesChart";
import { InventoryReportTable } from "@/components/admin/analytics/InventoryReportTable";
import {
  getGamesPlayedSummary,
  getAnswerAccuracySummary,
  getPrizeClaimSummary,
  getPrizeInventoryReport,
  getMostPopularGames,
  getDailyParticipation,
} from "@/lib/queries/analytics";

export const metadata: Metadata = {
  title: "Analytics",
};

/**
 * Real, database-backed analytics -- games played, correct/incorrect
 * answers, prizes claimed, inventory, most popular game, and a daily
 * participation trend, each pulled from one of the six admin-only RPCs in
 * `supabase/migrations/20260716010000_analytics_dashboard.sql` via
 * `lib/queries/analytics.ts`. This replaces the earlier "coming soon" stub;
 * the Dashboard (`/admin`) keeps its own lighter-weight overview cards
 * (Section 8/`queries/dashboard.ts`) unchanged -- this page is the deeper,
 * purpose-built reporting view those cards always linked out to.
 */
export default async function AnalyticsPage() {
  const [gamesPlayed, accuracy, claims, inventory, popularGames, dailyParticipation] = await Promise.all([
    getGamesPlayedSummary(),
    getAnswerAccuracySummary(),
    getPrizeClaimSummary(),
    getPrizeInventoryReport(),
    getMostPopularGames(8),
    getDailyParticipation(30),
  ]);

  const lowStockCount = inventory.filter(
    (row) => row.isActive && row.quantityAvailable <= row.lowStockThreshold
  ).length;
  const topGame = popularGames.find((game) => game.sessionsCount > 0) ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">
          Games played, answer accuracy, prize claims, and inventory -- all pulled live from the database.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            index={0}
            label="Games Played"
            value={gamesPlayed.totalSessions}
            description={`${gamesPlayed.completedSessions} completed · ${gamesPlayed.sessionsToday} today`}
            icon={Gamepad2}
          />
          <StatCard
            index={1}
            label="Correct Answers"
            value={accuracy.correctAnswers}
            description={`${accuracy.accuracyRate}% accuracy rate`}
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            index={2}
            label="Incorrect Answers"
            value={accuracy.incorrectAnswers}
            description={`${accuracy.correctAnswers + accuracy.incorrectAnswers} total answered`}
            icon={XCircle}
            tone={accuracy.incorrectAnswers > 0 ? "warning" : "default"}
          />
          <StatCard
            index={3}
            label="Prizes Claimed"
            value={claims.claimed}
            description={`${claims.claimRate}% of ${claims.totalWon} won`}
            icon={Gift}
            tone="success"
          />
          <StatCard
            index={4}
            label="Pending Claims"
            value={claims.pending}
            description="Won, not yet claimed"
            icon={Clock}
            tone={claims.pending > 0 ? "warning" : "default"}
          />
          <StatCard
            index={5}
            label="Most Popular Game"
            value={topGame?.gameName ?? "—"}
            description={topGame ? `${topGame.sessionsCount} sessions played` : "No sessions yet"}
            icon={Flame}
          />
          <StatCard
            index={6}
            label="Low Stock Prizes"
            value={lowStockCount}
            description="Active prizes at or below threshold"
            icon={AlertTriangle}
            tone={lowStockCount > 0 ? "warning" : "default"}
          />
          <StatCard
            index={7}
            label="Sessions, Last 7 Days"
            value={gamesPlayed.sessionsLast7Days}
            description="Trailing week"
            icon={Calendar}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Charts
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ChartCard
              title="Daily Participation"
              description="Sessions started and prizes won, per day, trailing 30 days."
            >
              <DailyParticipationChart data={dailyParticipation} />
            </ChartCard>
          </div>
          <ChartCard title="Most Popular Games" description="Ranked by total sessions played.">
            <PopularGamesChart games={popularGames} />
          </ChartCard>
          <ChartCard title="Answer Accuracy" description="Correct vs incorrect, across every game type.">
            <AnswerAccuracyChart summary={accuracy} />
          </ChartCard>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Inventory
        </h2>
        <InventoryReportTable inventory={inventory} />
      </section>
    </div>
  );
}
