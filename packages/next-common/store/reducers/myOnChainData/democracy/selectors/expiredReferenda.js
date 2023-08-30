import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { democracyLockingPeriodSelector } from "next-common/store/reducers/democracy/info";
import isVoteLockExpired from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/isVoteLockExpired";

const democracyVoteExpiredReferendaSelector = createSelector(
  myDemocracyVotingSelector,
  latestHeightSelector,
  democracyLockingPeriodSelector,
  (voting, latestHeight, lockingPeriod) => {
    if (!voting) {
      return [];
    }

    const { votes, isDelegating } = voting;
    if (isDelegating) {
      return [];
    }

    return votes.reduce((result, voteItem) => {
      const { referendumIndex, vote, referendumInfo } = voteItem;
      if (referendumInfo?.ongoing) {
        return result;
      } else if (referendumInfo && referendumInfo.finished) {
        const isExpired = isVoteLockExpired(
          vote,
          referendumInfo,
          latestHeight,
          lockingPeriod,
        );
        return isExpired ? [...result, referendumIndex] : result;
      } else {
        return result;
      }
    }, []);
  },
);

export default democracyVoteExpiredReferendaSelector;
