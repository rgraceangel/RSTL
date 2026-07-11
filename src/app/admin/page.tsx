import type { Metadata } from "next";
import {
  Gamepad2,
  Gift,
  Trophy,
  AlertTriangle,
  BarChart3,
  Percent,
  Coins,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import {
  getDashboardStats,
  getRecentWinners,
  getRecentActivity,
} from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatAction(action: string, entityType: string): string {
  const [verb] = action.split("_");
  const verbLabel = { insert: "Created", update: "Updated", delete: "Deleted" }[verb] ?? verb;
  const entityLabel = entityType.replace(/_/g, " ");
  return `${verbLabel} ${entityLabel}`;
}

export default async function AdminDashboardPage() {
  const [stats, recentWinners, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentWinners(5),
    getRecentActivity(8),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of games, prizes, and player activity.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            index={0}
            label="Active Games"
            value={stats.activeGames}
            description={`${stats.totalGames} total`}
            icon={Gamepad2}
          />
          <StatCard
            index={1}
            label="Sessions Today"
            value={stats.sessionsToday}
            description={`${stats.totalSessions} all time`}
            icon={Trophy}
          />
          <StatCard
            index={2}
            label="Prizes Won Today"
            value={stats.winnersToday}
            description={`${stats.totalWinners} all time`}
            icon={Gift}
          />
          <StatCard
            index={3}
            label="Low Stock Prizes"
            value={stats.lowStockPrizes}
            description={`${stats.totalPrizes} prizes total`}
            icon={AlertTriangle}
            tone={stats.lowStockPrizes > 0 ? "warning" : "default"}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Analytics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            index={4}
            label="Completed Sessions"
            value={stats.completedSessions}
            description="All time"
            icon={BarChart3}
          />
          <StatCard
            index={5}
            label="Win Rate"
            value={`${stats.winRate}%`}
            description="Wins / completed sessions"
            icon={Percent}
            tone="success"
          />
          <StatCard
            index={6}
            label="Prize Value Awarded"
            value={stats.totalPrizeValueAwarded.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
            description="All time, non-cancelled wins"
            icon={Coins}
          />
          <StatCard
            index={7}
            label="Average Score"
            value={stats.averageScore}
            description="Completed sessions"
            icon={TrendingUp}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Recent Winners</h3>
          </div>
          <ul className="divide-y divide-border">
            {recentWinners.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No winners yet.</li>
            )}
            {recentWinners.map((winner) => (
              <li key={winner.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{winner.player_display}</p>
                  <p className="text-xs text-muted-foreground">
                    {winner.prize_name} · {winner.game_name}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(winner.won_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
          </div>
          <ul className="divide-y divide-border">
            {recentActivity.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">No activity yet.</li>
            )}
            {recentActivity.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">
                    {formatAction(entry.action, entry.entity_type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.adminName ?? "System"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
