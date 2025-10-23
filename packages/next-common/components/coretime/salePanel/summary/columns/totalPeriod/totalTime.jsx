import useBlockTime from "next-common/context/coretime/hooks/useBlockTime";
import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";

export default function TotalTime({ totalBlockGap }) {
  const blockTime = useBlockTime();
  const totalBlocksTime = useEstimateBlocksTimeWithBlockTime(
    totalBlockGap,
    blockTime,
  );

  return (
    <div className="text12Medium text-textTertiary">/ {totalBlocksTime}</div>
  );
}
