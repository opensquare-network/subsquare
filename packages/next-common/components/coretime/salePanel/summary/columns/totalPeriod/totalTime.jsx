import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";

export default function TotalTime({ totalBlockGap }) {
  const blockTime = useRelayChainBlockTime();
  const totalBlocksTime = useEstimateBlocksTimeWithBlockTime(
    totalBlockGap,
    blockTime,
  );

  return (
    <div className="text12Medium text-textTertiary">/ {totalBlocksTime}</div>
  );
}
