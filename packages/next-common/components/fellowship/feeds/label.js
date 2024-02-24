import FellowshipRank from "next-common/components/fellowship/rank";
import tw from "tailwind-styled-components";

export const FellowshipFeedEventLabel = tw.span`text-textSecondary`;

export function FellowshipFeedRankLabel({ rank }) {
  return (
    <FellowshipFeedEventLabel className="inline-flex items-center gap-x-1">
      Rank
      <FellowshipRank rank={rank} />
    </FellowshipFeedEventLabel>
  );
}
