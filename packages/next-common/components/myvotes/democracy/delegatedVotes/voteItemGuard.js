import { useSelector } from "react-redux";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

export default function VoteItemGuard({ targetVote, children }) {
  const voting = useSelector(myDemocracyVotingSelector);
  if (
    !targetVote ||
    !voting ||
    !voting.isDelegating ||
    !targetVote.isStandard
  ) {
    return null;
  }

  return children;
}
