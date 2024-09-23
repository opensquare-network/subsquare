import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

export default function Period({ blocks = 0 }) {
  const estimatedBlocksTime = useEstimateBlocksTime(blocks);
  if (blocks <= 0) {
    return "∞";
  }

  return (
    <div>
      <Tooltip side="top" content={`${blocks?.toLocaleString?.()} blocks`}>
        <span>{estimatedBlocksTime}</span>
      </Tooltip>
    </div>
  );
}
