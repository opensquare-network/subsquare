import {
  allNestedVotesSelector,
  allVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
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

function StandardAyeTag({ tooltipContent }) {
  return (
    <TagWrapper
      className="bg-green100 text-green500"
      tooltipContent={tooltipContent}
    >
      Aye
    </TagWrapper>
  );
}

function StandardNayTag({ tooltipContent }) {
  return (
    <TagWrapper
      className="bg-red100 text-red500"
      tooltipContent={tooltipContent}
    >
      Nay
    </TagWrapper>
  );
}

export function StandardVoteTagWithTooltipContent({ vote, tooltipContent }) {
  if (vote.aye) {
    return <StandardAyeTag tooltipContent={tooltipContent} />;
  } else {
    return <StandardNayTag tooltipContent={tooltipContent} />;
  }
}

export function StandardVoteTag({ vote, allNestedVotes }) {
  const tooltipContent = (
    <StandardVoteTooltipContent vote={vote} allNestedVotes={allNestedVotes} />
  );
  return (
    <StandardVoteTagWithTooltipContent
      vote={vote}
      tooltipContent={tooltipContent}
    />
  );
}

export function SplitVoteTag({ votes }) {
  return (
    <TagWrapper
      className="bg-neutral300 text-textSecondary"
      tooltipContent={<SplitVoteTooltipContent votes={votes} />}
    >
      Split
    </TagWrapper>
  );
}

export function SplitAbstainVoteTag({ votes }) {
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
  const allNestedVotes = useSelector(allNestedVotesSelector);

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
    return (
      <StandardVoteTag vote={firstVoteItem} allNestedVotes={allNestedVotes} />
    );
  } else if (firstVoteItem.isSplit) {
    return <SplitVoteTag votes={votes} />;
  } else if (firstVoteItem.isSplitAbstain) {
    return <SplitAbstainVoteTag votes={votes} />;
  }

  return null;
}
