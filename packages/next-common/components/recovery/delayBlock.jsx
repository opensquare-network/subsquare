import Tooltip from "next-common/components/tooltip";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { isNil } from "lodash-es";

export default function DelayBlock({ blocks }) {
  const estimatedTime = useEstimateBlocksTime(blocks);

  if (isNil(blocks)) {
    return null;
  }

  return (
    <Tooltip content={`${blocks} blocks ≈ ${estimatedTime}`}>
      <span className="text14Medium text-textPrimary">
        {blocks?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}
