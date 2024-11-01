import CountDown from "next-common/components/summary/countDown";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function SalePeriodCountdown({ percentage, className = "" }) {
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
