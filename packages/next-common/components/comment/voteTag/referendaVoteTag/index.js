import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";
import { useComment } from "../../context";
import Tooltip from "next-common/components/tooltip";
import SplitVoteTooltipContent from "./splitVoteTooltipContent";
import SplitAbstainVoteTooltipContent from "./splitAbstainTooltipContent";
import StandardVoteTooltipContent from "./standardVoteTooltipContent";
import { cn } from "next-common/utils";
import { useMemo } from "react";

function TagWrapper({ className, tooltipContent, children }) {
  return (
    <Tooltip content={tooltipContent}>
      <div
        className={cn(
          "py-[2px] px-[8px] rounded-[10px] text12Medium",
          className,
        )}
      >
        {children}
      </div>
    </Tooltip>
  );
}

function StandardAyeTag({ vote }) {
  return (
    <TagWrapper
      className="bg-green100 text-green500"
      tooltipContent={<StandardVoteTooltipContent vote={vote} />}
    >
      Aye
    </TagWrapper>
  );
}

function StandardNayTag({ vote }) {
  return (
    <TagWrapper
      className="bg-red100 text-red500"
      tooltipContent={<StandardVoteTooltipContent vote={vote} />}
    >
      Nay
    </TagWrapper>
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
    <TagWrapper
      className="bg-neutral300 text-textSecondary"
      tooltipContent={<SplitVoteTooltipContent votes={votes} />}
    >
      Split
    </TagWrapper>
  );
}

function SplitAbstainVoteTag({ votes }) {
  return (
    <TagWrapper
      className="bg-neutral300 text-textSecondary"
      tooltipContent={<SplitAbstainVoteTooltipContent votes={votes} />}
    >
      SplitAbstain
    </TagWrapper>
  );
}

export default function ReferendaVoteTag() {
  const comment = useComment();
  const allVotes = useSelector(allVotesSelector);

  const user = comment?.author;
  const votes = useMemo(
    () => (allVotes || []).filter((item) => item.account === user?.address),
    [allVotes, user?.address],
  );

  if (votes.length === 0) {
    return null;
  }

  const firstVoteItem = votes[0];

  if (firstVoteItem.isStandard || firstVoteItem.isDelegating) {
    return <StandardVoteTag vote={firstVoteItem} />;
  } else if (firstVoteItem.isSplit) {
    return <SplitVoteTag votes={votes} />;
  } else if (firstVoteItem.isSplitAbstain) {
    return <SplitAbstainVoteTag votes={votes} />;
  }

  return null;
}
