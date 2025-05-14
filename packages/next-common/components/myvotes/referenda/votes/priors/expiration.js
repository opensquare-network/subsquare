import useChainOrScanHeight from "next-common/hooks/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function Expiration({ unlockAt }) {
  const latestHeight = useChainOrScanHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(unlockAt - latestHeight),
  );

  return (
    <span className="text14Medium text-textTertiary">
      {estimatedBlocksTime}
    </span>
  );
}
