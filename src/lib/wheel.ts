/**
 * Shared spin-rotation math for `<Wheel>` consumers (`GameWheel`,
 * `PrizeWheel`, `SpinWheelGame`). Kept as a plain, framework-free utility so
 * every wheel never carries its own slightly-different copy of the same
 * geometry.
 */

/** Total spin animation duration -- shared by `Wheel.tsx`'s Framer Motion transition and `scheduleSpinTicks` below, so tick sounds stay in sync with the animation. */
export const WHEEL_SPIN_DURATION_MS = 3600;

/** Normalizes any degree value into the 0-360 range. */
export function mod360(value: number): number {
  return ((value % 360) + 360) % 360;
}

/**
 * Computes the next total rotation (monotonically increasing, so the wheel
 * always spins forward rather than snapping back) needed to land a wheel of
 * `segmentCount` equal wedges on `targetIndex`, given the wheel's current
 * total `currentRotation`. Adds a small random jitter within the wedge for
 * visual realism, and several extra full spins for a satisfying animation.
 */
export function computeSpinRotation(currentRotation: number, segmentCount: number, targetIndex: number): number {
  const segmentAngle = 360 / segmentCount;
  const targetMod = mod360(-(segmentAngle * (targetIndex + 0.5)));
  const currentMod = mod360(currentRotation);
  const delta = mod360(targetMod - currentMod);
  const jitter = (Math.random() - 0.5) * segmentAngle * 0.6;
  const extraSpins = 6 * 360;

  return currentRotation + extraSpins + delta + jitter;
}

/**
 * Schedules approximate "tick" callbacks for each wheel-segment boundary
 * crossed during a spin of `totalDeltaDegrees` (i.e. `nextRotation -
 * previousRotation`), using a simple ease-out-cubic curve. This is a
 * decorative audio cue, not a physics simulation, so it deliberately doesn't
 * try to replicate `Wheel.tsx`'s exact Framer Motion cubic-bezier easing --
 * a perceptually-close deceleration curve is all a tick sound needs.
 *
 * Returns a cleanup function that clears any timeouts that haven't fired
 * yet -- call it on unmount or before scheduling a new spin's ticks.
 */
export function scheduleSpinTicks(
  totalDeltaDegrees: number,
  segmentAngle: number,
  durationMs: number,
  onTick: () => void
): () => void {
  const totalSegmentsCrossed = Math.floor(totalDeltaDegrees / segmentAngle);
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  for (let crossed = 1; crossed <= totalSegmentsCrossed; crossed++) {
    const targetProgress = (crossed * segmentAngle) / totalDeltaDegrees;

    // Binary-search the inverse of easeOutCubic (monotonic on [0, 1]).
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (easeOutCubic(mid) < targetProgress) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const delayMs = ((lo + hi) / 2) * durationMs;
    timeouts.push(setTimeout(onTick, delayMs));
  }

  return () => {
    timeouts.forEach(clearTimeout);
  };
}
