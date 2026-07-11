import { Hero } from "@/components/site/Hero";
import { WheelArena } from "@/components/site/WheelArena";
import { HowItWorks } from "@/components/site/HowItWorks";
import { RecentWinners } from "@/components/site/RecentWinners";
import { getActivePrizesForWheel, getRecentWinnersFeed } from "@/lib/queries/public";
import { PRIZE_WHEEL_FALLBACK, WHEEL_COLORS } from "@/constants";
import type { WheelSegment } from "@/types";

/** Minimum number of active prizes before the live catalog replaces the fallback wheel content. */
const MIN_LIVE_PRIZES = 3;

export default async function HomePage() {
  const [dbPrizes, winners] = await Promise.all([getActivePrizesForWheel(), getRecentWinnersFeed()]);

  const prizeSegments: WheelSegment[] =
    dbPrizes.length >= MIN_LIVE_PRIZES
      ? dbPrizes.map((prize, index) => ({
          id: prize.id,
          label: prize.name,
          color: WHEEL_COLORS[index % WHEEL_COLORS.length],
          weight: prize.probability_weight,
        }))
      : PRIZE_WHEEL_FALLBACK;

  return (
    <>
      <Hero />
      <WheelArena prizeSegments={prizeSegments} />
      <HowItWorks />
      <RecentWinners winners={winners} />
    </>
  );
}
