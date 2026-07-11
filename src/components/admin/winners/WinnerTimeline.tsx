import Image from "next/image";
import { Trophy, CheckCircle2, Ban, Clock, Gamepad2, ImageOff } from "lucide-react";
import type { WinnerDetail } from "@/lib/queries/winners";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

interface TimelineStep {
  label: string;
  timestamp: string | null;
  icon: typeof Trophy;
  done: boolean;
  tone: "default" | "success" | "danger" | "muted";
}

const TONE_STYLES: Record<TimelineStep["tone"], string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-50 text-red-600",
  muted: "bg-muted text-muted-foreground",
};

/** "Prize history" view: the full timeline for a single win, plus its linked context. */
export function WinnerTimeline({ winner }: { winner: WinnerDetail }) {
  const steps: TimelineStep[] = [
    {
      label: "Won",
      timestamp: winner.won_at,
      icon: Trophy,
      done: true,
      tone: "default",
    },
  ];

  if (winner.status === "cancelled") {
    steps.push({
      label: "Cancelled",
      timestamp: winner.cancelled_at,
      icon: Ban,
      done: true,
      tone: "danger",
    });
  } else if (winner.status === "expired") {
    steps.push({
      label: "Expired",
      timestamp: null,
      icon: Clock,
      done: true,
      tone: "muted",
    });
  } else {
    steps.push({
      label: "Claimed",
      timestamp: winner.claimed_at,
      icon: CheckCircle2,
      done: winner.status === "claimed",
      tone: winner.status === "claimed" ? "success" : "muted",
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
        <ol className="space-y-4">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-3">
              <span className={`rounded-full p-2 ${TONE_STYLES[step.tone]}`}>
                <step.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-muted-foreground">
                  {step.done ? formatDate(step.timestamp) : "Not yet"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Prize</h3>
        {winner.prize ? (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {winner.prize.image_url ? (
                <Image
                  src={winner.prize.image_url}
                  alt={winner.prize.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{winner.prize.name}</p>
              <p className="text-xs text-muted-foreground">
                {winner.prize.value.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Prize no longer exists.</p>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Gamepad2 className="h-4 w-4" />
          Game session
        </h3>
        {winner.session ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Game</dt>
              <dd>{winner.game?.name ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Score</dt>
              <dd>{winner.session.score}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Started</dt>
              <dd>{formatDate(winner.session.started_at)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ended</dt>
              <dd>{formatDate(winner.session.ended_at)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">Session no longer exists.</p>
        )}
      </div>
    </div>
  );
}
