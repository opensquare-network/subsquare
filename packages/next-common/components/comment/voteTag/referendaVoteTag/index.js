import { allDirectVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import SplitVoteTooltipContent from "./splitVoteTooltipContent";
import SplitAbstainVoteTooltipContent from "./splitAbstainTooltipContent";
import StandardVoteTooltipContent from "./standardVoteTooltipContent";

const TagWrapper = tw.span`py-[2px] px-[8px] rounded-[10px] text12Medium`;

function StandardAyeTag({ vote }) {
  return (
    <Tooltip content={<StandardVoteTooltipContent vote={vote} />}>
      <TagWrapper className="bg-green100 text-green500">Aye</TagWrapper>
    </Tooltip>
  );
}

function StandardNayTag({ vote }) {
  return (
    <Tooltip content={<StandardVoteTooltipContent vote={vote} />}>
      <TagWrapper className="bg-red100 text-red500">Nay</TagWrapper>
    </Tooltip>
  );
}

function StandardVoteTag({ vote }) {
  if (vote.aye) {
    return <StandardAyeTag vote={vote} />;
  } else {
    return <StandardNayTag vote={vote} />;
  }
}

function SplitVoteTag({ votes }) {
  return (
    <Tooltip content={<SplitVoteTooltipContent votes={votes} />}>
      <TagWrapper className="bg-neutral300 text-textSecondary">
        Split
      </TagWrapper>
    </Tooltip>
  );
}

function SplitAbstainVoteTag({ votes }) {
  return (
    <Tooltip content={<SplitAbstainVoteTooltipContent votes={votes} />}>
      <TagWrapper className="bg-neutral300 text-textSecondary">
        SplitAbstain
      </TagWrapper>
    </Tooltip>
  );
}

export default function ReferendaVoteTag() {
  const comment = useComment();
  const allDirectVotes = useSelector(allDirectVotesSelector);

  const user = comment.author;
  const votes = (allDirectVotes || []).filter(
    (item) => item.account === user.address,
  );

  if (votes.length === 0) {
    return null;
  }

  const voteItem = votes[0];

  if (voteItem.isStandard) {
    return <StandardVoteTag vote={voteItem} />;
  } else if (voteItem.isSplit) {
    return <SplitVoteTag votes={votes} />;
  } else if (voteItem.isSplitAbstain) {
    return <SplitAbstainVoteTag votes={votes} />;
  }

  return null;
}
