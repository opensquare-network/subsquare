import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

export default function PassedTime({ passedBlockGap, remaining }) {
  const passedBlocksTime = useEstimateBlocksTime(passedBlockGap);

  const formattedTime = passedBlocksTime.split(" ").map((item, index) => (
    <span key={index}>
      <span
        className={index % 2 === 0 ? "text-textPrimary" : "text-textTertiary"}
      >
        {item}
      </span>
    </span>
  ));

  return (
    <Tooltip content={remaining} className="inline-flex items-center gap-x-1">
      {formattedTime}
    </Tooltip>
  );
}
