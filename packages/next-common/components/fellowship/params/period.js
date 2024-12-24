import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

function PeriodCommon({ blocks = 0 }) {
  const estimatedBlocksTime = useEstimateBlocksTime(blocks);
  return (
    <div>
      <Tooltip side="top" content={`${blocks?.toLocaleString?.()} blocks`}>
        <span>{estimatedBlocksTime}</span>
      </Tooltip>
    </div>
  );
}

export function PromotionPeriod({ blocks = 0 }) {
  if (blocks <= 0) {
    return "-";
  }

  return <PeriodCommon blocks={blocks} />;
}

export default function Period({ blocks = 0 }) {
  if (blocks <= 0) {
    return "∞";
  }

  return <PeriodCommon blocks={blocks} />;
}
