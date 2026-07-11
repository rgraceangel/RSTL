"use client";

import { motion } from "framer-motion";
import { Atom, Dna, FlaskConical, Orbit, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOATERS = [
  { Icon: Atom, top: "10%", left: "8%", size: 28, duration: 7, delay: 0 },
  { Icon: Dna, top: "68%", left: "14%", size: 24, duration: 9, delay: 0.5 },
  { Icon: Orbit, top: "20%", left: "88%", size: 32, duration: 8, delay: 1 },
  { Icon: FlaskConical, top: "78%", left: "82%", size: 26, duration: 10, delay: 0.3 },
  { Icon: Sparkles, top: "44%", left: "50%", size: 20, duration: 6, delay: 0.8 },
] as const;

/**
 * Reusable ambient science-theme backdrop -- absolutely positioned,
 * pointer-events-none, safe to drop behind any section. Used by `Hero`;
 * available for future sections that want the same motif.
 */
export function ScienceBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      {FLOATERS.map(({ Icon, top, left, size, duration, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/20"
          style={{ top, left }}
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}
