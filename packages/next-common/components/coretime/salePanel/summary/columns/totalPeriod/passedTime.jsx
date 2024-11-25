import { useEstimateBlocksTime } from "next-common/utils/hooks";
import Tooltip from "next-common/components/tooltip";

export default function PassedTime({ passedBlockGap, remaining }) {
  const passedBlocksTime = useEstimateBlocksTime(passedBlockGap);
  const hasGoneContent = `${passedBlocksTime} has gone`;

  const formattedTime = remaining.split(" ").map((item, index) => (
    <span key={index}>
      <span
        className={index % 2 === 0 ? "text-textPrimary" : "text-textTertiary"}
      >
        {item}
      </span>
    </span>
  ));

  return (
    <Tooltip
      content={hasGoneContent}
      className="inline-flex items-center gap-x-1"
    >
      {formattedTime}
    </Tooltip>
  );
}
