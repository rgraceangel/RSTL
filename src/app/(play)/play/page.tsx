import { GameEngine } from "@/components/play/GameEngine";
import { getRandomActiveGame, getAvailablePrizesForWheel } from "@/lib/queries/play";
import { WHEEL_COLORS } from "@/constants";
import type { WheelSegment } from "@/types";

export default async function PlayPage() {
  const [game, prizes] = await Promise.all([getRandomActiveGame(), getAvailablePrizesForWheel()]);

  if (!game) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold">No games are live right now</h1>
        <p className="max-w-md text-muted-foreground">
          Check back soon -- an admin needs to publish at least one active Quiz or Spin Wheel game before you can
          play.
        </p>
      </div>
    );
  }

  if (prizes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold">No prizes in stock right now</h1>
        <p className="max-w-md text-muted-foreground">
          Every prize is either inactive or out of stock. Check back once the catalog is restocked.
        </p>
      </div>
    );
  }

  const segments: WheelSegment[] = prizes.map((prize, index) => ({
    id: prize.id,
    label: prize.name,
    color: WHEEL_COLORS[index % WHEEL_COLORS.length],
    weight: prize.probability_weight,
  }));

  return <GameEngine game={game} prizeSegments={segments} />;
}
