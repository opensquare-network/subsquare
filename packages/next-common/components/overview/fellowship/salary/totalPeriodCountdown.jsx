import Remaining from "next-common/components/remaining";
import Tooltip from "next-common/components/tooltip";
import CountDown from "next-common/components/summary/countDown";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function FellowshipTotalPeriodCountdown({
  percentage,
  totalRemain,
}) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn("flex", navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
    >
      <Tooltip content={!!totalRemain && <Remaining blocks={totalRemain} />}>
        <CountDown percent={percentage} />
      </Tooltip>
    </div>
  );
}
