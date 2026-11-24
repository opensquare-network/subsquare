import CountDown from "next-common/components/_CountDown";
import { useRemainingTime } from "next-common/components/remaining";
import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

function Remaining({
  totalBlocks = 0,
  blocks = 0,
  percentage,
  blockTime,
  dropInsignificant = false,
}) {
  const chainBlockTime = useSelector(blockTimeSelector);
  const total = useEstimateBlocksTimeWithBlockTime(
    totalBlocks,
    blockTime ?? chainBlockTime,
    dropInsignificant,
  );
  const remaining = useRemainingTime(blocks, blockTime, dropInsignificant);

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
  blockTime,
  dropInsignificant = false,
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
            blockTime={blockTime}
            dropInsignificant={dropInsignificant}
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
