import CountDown from "next-common/components/_CountDown";
import { useRemainingTime } from "next-common/components/remaining";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

function Remaining({ totalBlocks = 0, blocks = 0, percentage }) {
  const total = useEstimateBlocksTime(totalBlocks);
  const remaining = useRemainingTime(blocks);

  if (!totalBlocks) {
    return `${percentage}%`;
  }

  if (percentage && blocks > 0) {
    return `${percentage}%, ${remaining}`;
  }

  if (percentage && blocks <= 0) {
    return `${percentage}%, total ${total}`;
  }

  return remaining;
}

export default function RemainLabel({
  percentage,
  label,
  total,
  remain,
  text,
}) {
  return (
    <div className="flex items-center text12Medium">
      <CountDown
        numerator={percentage}
        denominator={100}
        tooltipContent={
          <Remaining
            totalBlocks={total}
            blocks={remain}
            percentage={percentage}
          />
        }
        backgroundColor="var(--theme100)"
        foregroundColor="var(--theme500)"
      />
      <span className="ml-2">
        <span className="text-textTertiary">{label}</span> <span>{text}</span>
      </span>
    </div>
  );
}
