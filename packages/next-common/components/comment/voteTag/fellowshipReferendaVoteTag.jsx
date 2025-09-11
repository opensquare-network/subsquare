import { find, flatten, isNil } from "lodash-es";
import { fellowshipVotesSelector } from "next-common/store/reducers/fellowship/votes";
import { useSelector } from "react-redux";
import { useComment } from "../context";
import { StandardVoteTagWithTooltipContent } from "./referendaVoteTag";

export default function FellowshipReferendaVoteTag() {
  const comment = useComment();
  const { allAye, allNay } = useSelector(fellowshipVotesSelector);
  const vote = find(flatten([allAye, allNay]), { address: comment.proposer });

  if (isNil(vote)) {
    return null;
  }

  return (
    <StandardVoteTagWithTooltipContent
      vote={{ aye: vote.isAye }}
      tooltipContent={`Votes: ${vote.votes}`}
    />
  );
}
