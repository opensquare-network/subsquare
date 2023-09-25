import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { useSelector } from "react-redux";
import { VoteForItemWrapper } from "../../styled";
import { VoteItem } from "next-common/components/profile/votingHistory/common";
import VotingGuard from "./votingGuard";
import useDelegatedVoteLock from "./useDelegatedVoteLock";
import VoteLock from "../../vote/lock";

function DelegatedVoteLock({ referendumInfo, targetVote }) {
  const voting = useSelector(myDemocracyVotingSelector);
  const delegatedVote = {
    isDelegating: true,
    balance: voting.balance,
    conviction: voting.conviction,
  };

  const lockInfo = useDelegatedVoteLock(
    referendumInfo,
    delegatedVote,
    targetVote,
  );
  if (!lockInfo) {
    return null;
  }

  return (
    <VotingGuard>
      <VoteLock lockInfo={lockInfo} />
    </VotingGuard>
  );
}

export default function DelegatedVoteForItem({ targetVote, referendumInfo }) {
  const voting = useSelector(myDemocracyVotingSelector);
  if (
    !targetVote ||
    !voting ||
    !voting.isDelegating ||
    !targetVote.isStandard
  ) {
    return null;
  }

  const { balance, conviction } = voting;
  const { aye } = targetVote?.vote || {};

  return (
    <VoteForItemWrapper>
      <VoteItem
        key="vote"
        vote={{ balance, conviction, aye, isDelegating: true }}
      />
      <DelegatedVoteLock
        referendumInfo={referendumInfo}
        targetVote={targetVote}
      />
    </VoteForItemWrapper>
  );
}
