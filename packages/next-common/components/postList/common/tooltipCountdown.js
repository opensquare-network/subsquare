import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";

export default function TooltipCountdown({ start, end, now, tooltipPrefix }) {
  const estimatedBlocksTime = useEstimateBlocksTime(end - now);
  const text = `${tooltipPrefix} in ${estimatedBlocksTime}`;

  return (
    <CountDown
      numerator={now - start}
      denominator={end - start}
      tooltipContent={text}
    />
  );
}
