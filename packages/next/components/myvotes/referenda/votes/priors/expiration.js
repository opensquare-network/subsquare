import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function Expiration({ unlockAt }) {
  const latestHeight = useBlockHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(unlockAt - latestHeight),
  );

  return (
    <span className="text14Medium text-textTertiary">
      {estimatedBlocksTime}
    </span>
  );
}
