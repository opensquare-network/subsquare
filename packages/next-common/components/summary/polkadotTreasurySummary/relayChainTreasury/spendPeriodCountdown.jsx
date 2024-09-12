import Tooltip from "next-common/components/tooltip";
import CountDown from "next-common/components/_CountDown";

export default function SpendPeriodCountdown({ summary }) {
  return (
    <Tooltip content={`${summary?.progress ?? 0}%`}>
      <span className="ml-2">
        <CountDown
          numerator={summary?.progress ?? 0}
          denominator={100}
          backgroundColor="var(--theme100)"
          foregroundColor="var(--theme500)"
        />
      </span>
    </Tooltip>
  );
}
