"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { RecentWinnerFeedItem } from "@/lib/queries/public";

interface RecentWinnersProps {
  winners: RecentWinnerFeedItem[];
}

/** Public "recent winners" feed -- fed by the `recent_winners_feed` view (server-fetched in `page.tsx`). */
export function RecentWinners({ winners }: RecentWinnersProps) {
  return (
    <section id="winners" className="py-20">
      <Container>
        <SectionHeading eyebrow="Live Feed" title="Recent Winners" subtitle="Real wins from across the platform." />

        {winners.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No wins recorded yet -- be the first once a game goes live.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-border p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {winner.player_display} won {winner.prize_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{winner.game_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
