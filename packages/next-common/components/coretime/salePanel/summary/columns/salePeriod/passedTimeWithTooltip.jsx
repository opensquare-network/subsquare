import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

export default function PassedTimeWithTooltip({ passedBlockGap, remaining }) {
  const passedBlocksTime = useEstimateBlocksTime(passedBlockGap);
  return (
    <Tooltip content={remaining} className="inline-flex items-center">
      {passedBlocksTime}
    </Tooltip>
  );
}
