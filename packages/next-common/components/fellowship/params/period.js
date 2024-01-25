import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { InlineBlockTooltip } from "next-common/components/tooltip";

export default function Period({ blocks = 0 }) {
  const estimatedBlocksTime = useEstimateBlocksTime(blocks);

  return (
    <div>
      <InlineBlockTooltip
        side="top"
        content={`${blocks?.toLocaleString?.()} blocks`}
      >
        <span>{estimatedBlocksTime}</span>
      </InlineBlockTooltip>
    </div>
  );
}
