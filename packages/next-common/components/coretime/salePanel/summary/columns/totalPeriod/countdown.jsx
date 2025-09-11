import CountDown from "next-common/components/summary/countDown";
import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function TotalPeriodCountdown({ percentage, className = "" }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "flex",
        navCollapsed ? "max-sm:hidden" : "max-md:hidden",
        className,
      )}
    >
      <CountDown percent={percentage} />
    </div>
  );
}
