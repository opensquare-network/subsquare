import { useEstimateBlocksTime } from "next-common/utils/hooks";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export default function Expiration({ unlockAt }) {
  const latestHeight = useAhmLatestHeight();
  const estimatedBlocksTime = useEstimateBlocksTime(
    Math.abs(unlockAt - latestHeight),
  );

  return (
    <span className="text14Medium text-textTertiary">
      {estimatedBlocksTime}
    </span>
  );
}
