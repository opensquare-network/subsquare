import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function TotalTime({ totalBlockGap }) {
  const totalBlocksTime = useEstimateBlocksTime(totalBlockGap);

  return (
    <div className="text12Medium text-textTertiary">/ {totalBlocksTime}</div>
  );
}
