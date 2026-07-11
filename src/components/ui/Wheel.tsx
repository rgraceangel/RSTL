"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { WheelSegment } from "@/types";
import { WHEEL_SPIN_DURATION_MS } from "@/lib/wheel";
import { cn } from "@/lib/utils";

interface WheelProps {
  segments: WheelSegment[];
  /** Monotonically-increasing total rotation in degrees, owned by the parent (Game/Prize/SpinWheelGame). */
  rotation: number;
  size?: number;
  /** Rendered, non-rotating, absolutely-centered content (e.g. an icon badge). */
  hub?: React.ReactNode;
  /** Visually locks the wheel (grayscale + dimmed) without touching interaction, which the parent controls separately. */
  dimmed?: boolean;
  onSettled?: () => void;
  className?: string;
}

const CENTER = 110;
const RADIUS = 100;
const LABEL_RADIUS = 64;

function polarToCartesian(angleDeg: number, radius: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

/**
 * Generic, reusable spinning wheel -- pure presentation. Every wheel in the
 * app (the homepage's `GameWheel`/`PrizeWheel`, and the real `SpinWheelGame`
 * player engine) is a thin wrapper around this: they own the spin logic
 * (target segment, win/lose semantics, server round-trips), this component
 * only owns the SVG wedge geometry and the rotation animation. `rotation` is
 * expected to only ever increase (never reset to 0) so the spin always
 * animates forward. Lives in `components/ui/` (not a domain folder) because
 * it's genuinely cross-domain -- moved here from `components/site/` once the
 * player engine needed the exact same primitive.
 */
export function Wheel({ segments, rotation, size = 260, hub, dimmed, onSettled, className }: WheelProps) {
  const segmentAngle = 360 / segments.length;

  const wedges = useMemo(
    () =>
      segments.map((segment, index) => {
        const startAngle = index * segmentAngle - 90;
        const endAngle = startAngle + segmentAngle;
        const midAngle = startAngle + segmentAngle / 2;

        const start = polarToCartesian(startAngle, RADIUS);
        const end = polarToCartesian(endAngle, RADIUS);
        const largeArc = segmentAngle > 180 ? 1 : 0;
        const label = polarToCartesian(midAngle, LABEL_RADIUS);

        return {
          id: segment.id,
          label: segment.label,
          color: segment.color,
          path: `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
          labelX: label.x,
          labelY: label.y,
          labelRotation: midAngle,
        };
      }),
    [segments, segmentAngle]
  );

  return (
    <div className={cn("relative", className)}>
      {/* Pointer -- fixed at the top, outside the rotating group. */}
      <svg
        aria-hidden
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className="pointer-events-none absolute inset-0"
      >
        <path d="M 110 2 L 98 24 L 122 24 Z" fill="hsl(var(--foreground))" />
      </svg>

      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className={cn("transition-[filter,opacity] duration-300", dimmed && "opacity-60 grayscale")}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="hsl(var(--border))" strokeWidth={4} />
        <motion.g
          style={{ transformOrigin: "50% 50%" }}
          animate={{ rotate: rotation }}
          transition={{ duration: WHEEL_SPIN_DURATION_MS / 1000, ease: [0.12, 0.67, 0.1, 0.99] }}
          onAnimationComplete={onSettled}
        >
          {wedges.map((wedge) => (
            <g key={wedge.id}>
              <path d={wedge.path} fill={wedge.color} stroke="hsl(var(--background))" strokeWidth={1.5} />
              <text
                x={wedge.labelX}
                y={wedge.labelY}
                transform={`rotate(${wedge.labelRotation}, ${wedge.labelX}, ${wedge.labelY})`}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#fff"
                style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))" }}
              >
                {wedge.label}
              </text>
            </g>
          ))}
        </motion.g>
        <circle cx={CENTER} cy={CENTER} r={32} fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth={2} />
      </svg>

      {hub && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background">{hub}</div>
        </div>
      )}
    </div>
  );
}
