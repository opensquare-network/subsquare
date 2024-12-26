import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { cn } from "next-common/utils";
import businessCategory from "next-common/utils/consts/business/category";
import Tooltip from "../../tooltip";
import { getMyVoteMarkFellowshipReferendaItems } from "./getMyVoteMarkFellowshipReferendaItems";
import { getMyVoteMarkReferendaItems } from "./getMyVoteMarkReferendaItems";

export default function PostListMyVoteMark({ data, category }) {
  const chainSettings = useChainSettings();

  const myVote = data?.myVote;

  if (isNil(myVote)) {
    return null;
  }

  let items;
  if (category === businessCategory.fellowship) {
    items = getMyVoteMarkFellowshipReferendaItems(myVote);
  } else if (
    category === businessCategory.openGovReferenda ||
    category === businessCategory.democracyReferenda
  ) {
    items = getMyVoteMarkReferendaItems(myVote, chainSettings);
  }

  if (isNil(items)) {
    return null;
  }

  const vote = myVote?.vote;

  return (
    <Tooltip
      className="p-1"
      content={
        items?.length && (
          <div>
            {items?.map((item) => (
              <div key={item.label}>
                {item.label}: {item.value}
              </div>
            ))}
          </div>
        )
      }
    >
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          (vote.aye || vote.isAye) && "bg-green500",
          (vote.aye === false || vote.isAye === false) && "bg-red500",
          (vote.isSplit || vote.isSplitAbstain) && "bg-neutral500",
        )}
      />
    </Tooltip>
  );
}
