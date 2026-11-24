import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

function PeriodCommon({ blocks = 0, suffix = "", blockTime }) {
  const chainBlockTime = useSelector(blockTimeSelector);
  const estimatedBlocksTime = useEstimateBlocksTimeWithBlockTime(
    blocks,
    blockTime ?? chainBlockTime,
    true,
  );
  return (
    <div>
      <Tooltip side="top" content={`${blocks?.toLocaleString?.()} blocks`}>
        <span>
          {estimatedBlocksTime}
          {suffix}
        </span>
      </Tooltip>
    </div>
  );
}

export function PromotionPeriod({ blocks = 0, suffix = "", blockTime }) {
  if (blocks <= 0) {
    return "-";
  }

  return <PeriodCommon blocks={blocks} suffix={suffix} blockTime={blockTime} />;
}

export default function Period({ blocks = 0, suffix = "", blockTime }) {
  if (blocks <= 0) {
    return "∞";
  }

  return <PeriodCommon blocks={blocks} suffix={suffix} blockTime={blockTime} />;
}
