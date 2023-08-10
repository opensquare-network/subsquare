import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import getOngoingVoteLock from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/getOngoingVoteLock";
import BigNumber from "bignumber.js";
import { democracyLockingPeriodSelector } from "next-common/store/reducers/democracy/info";
import getFinishedVoteLock from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/getFinishedVoteLock";

export const democracyLockRequiredSelector = createSelector(
  myDemocracyVotingSelector,
  latestHeightSelector,
  democracyLockingPeriodSelector,
  (voting, latestHeight, lockingPeriod) => {
    if (!voting) {
      return 0;
    }

    const { prior, votes, isDelegating, balance } = voting;

    const delegatingRequired = isDelegating ? balance : 0;

    const { unlockAt, balance: priorBalance } = prior;
    const priorRequired = latestHeight < unlockAt ? priorBalance : 0;

    const votesLockRequired = votes.reduce((result, voteItem) => {
      const { vote, referendumInfo } = voteItem;
      if (referendumInfo.ongoing) {
        const voteLock = getOngoingVoteLock(vote);
        return new BigNumber(result).plus(voteLock).toString();
      } else if (referendumInfo && referendumInfo.finished) {
        const voteLockRequired = getFinishedVoteLock(
          vote,
          referendumInfo,
          latestHeight,
          lockingPeriod,
        );
        return new BigNumber(result).plus(voteLockRequired).toString();
      } else {
        return result;
      }
    }, 0);

    return BigNumber.max(
      priorRequired,
      votesLockRequired,
      delegatingRequired,
    ).toString();
  },
);
