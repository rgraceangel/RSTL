"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { GameWheel } from "@/components/site/GameWheel";
import { PrizeWheel } from "@/components/site/PrizeWheel";
import type { WheelSegment } from "@/types";

interface WheelArenaProps {
  prizeSegments: WheelSegment[];
}

/**
 * Owns the one piece of shared state connecting the two wheels: whether the
 * player has "advanced" on the Game Wheel yet. Everything else (spin
 * animation, per-wheel results) is local to each wheel component.
 */
export function WheelArena({ prizeSegments }: WheelArenaProps) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <section id="play" className="relative overflow-hidden border-b border-border py-20">
      <Container>
        <SectionHeading
          eyebrow="The Experiment"
          title="Two Wheels. One Chance to Prove It."
          subtitle="Spin the Game Wheel to advance. Land a success and the Prize Wheel unlocks instantly."
        />

        <div className="mt-14 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.25 }}
          >
            <GameWheel onAdvance={() => setUnlocked(true)} advanced={unlocked} />
          </motion.div>

          <div className="hidden shrink-0 items-center justify-center lg:flex lg:pt-24">
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.25 }}
          >
            <PrizeWheel segments={prizeSegments} unlocked={unlocked} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
