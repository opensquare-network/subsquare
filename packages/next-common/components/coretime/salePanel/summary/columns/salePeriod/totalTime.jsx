import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function TotalTime({ totalBlockGap }) {
  const totalBlocksTime = useEstimateBlocksTime(totalBlockGap);
  return <div>/ {totalBlocksTime}</div>;
}
