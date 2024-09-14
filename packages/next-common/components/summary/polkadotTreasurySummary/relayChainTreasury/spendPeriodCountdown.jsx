import Tooltip from "next-common/components/tooltip";
import CountDown from "next-common/components/_CountDown";
import { toPercentage } from "next-common/utils";

export default function SpendPeriodCountdown({ summary }) {
  const progress = summary?.progress ?? 0;
  const percentage = toPercentage(progress / 100, 2);
  return (
    <Tooltip content={`${percentage}%`} className={"z-10"}>
      <span className="ml-2">
        <CountDown
          numerator={percentage}
          denominator={100}
          backgroundColor="var(--theme100)"
          foregroundColor="var(--theme500)"
        />
      </span>
    </Tooltip>
  );
}
