import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { useSelector } from "react-redux";
import { VoteForItemWrapper } from "../../styled";
import { VoteItem } from "next-common/components/profile/votingHistory/common";
import VotingGuard from "./votingGuard";
import useDelegatedVoteLock from "./useDelegatedVoteLock";
import VoteLock from "../../vote/lock";
import VoteItemGuard from "./voteItemGuard";
import { useMemo } from "react";

export function DelegatedVoteLock({ referendumInfo, targetVote }) {
  const voting = useSelector(myDemocracyVotingSelector);
  const delegatedVote = useMemo(() => {
    return {
      isDelegating: true,
      balance: voting.balance,
      conviction: voting.conviction,
    };
  }, [voting]);

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
  const { balance, conviction } = voting || {};
  const { aye } = targetVote || {};

  return (
    <VoteItemGuard targetVote={targetVote}>
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
    </VoteItemGuard>
  );
}
