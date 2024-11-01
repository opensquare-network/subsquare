import CountDown from "next-common/components/summary/countDown";
import { cn } from "next-common/utils";

export default function TotalPeriodCountdown({ percentage, className = "" }) {
  return (
    <div className={cn("flex", className)}>
      <CountDown percent={percentage} />
    </div>
  );
}
