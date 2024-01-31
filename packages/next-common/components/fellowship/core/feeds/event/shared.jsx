import FellowshipRank from "next-common/components/fellowship/rank";
import tw from "tailwind-styled-components";

export const FellowshipCoreFeedEventLabel = tw.span`text-textSecondary`;

export function getRowKey(indexer = {}) {
  return `${indexer?.blockHeight}-${indexer?.eventIndex}`;
}

export function FellowshipCoreFeedRankLabel({ rank }) {
  return (
    <FellowshipCoreFeedEventLabel className="inline-flex items-center gap-x-1">
      Rank
      <FellowshipRank rank={rank} />
    </FellowshipCoreFeedEventLabel>
  );
}
