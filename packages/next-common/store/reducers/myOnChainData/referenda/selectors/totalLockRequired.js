import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import getOnChainVoteLock from "./utils/getOnChainVoteLock";
import BigNumber from "bignumber.js";
import getFinishedVoteLock from "./utils/getFinishedVoteLock";

// calculate lock required on each track
function getEachTrackRequiredLock(voting, latestHeight, lockingPeriod) {
  const { isDelegating, balance, votes = [], prior } = voting;

  const delegatingRequired = isDelegating ? balance : 0;

  const { unlockAt, balance: priorBalance } = prior;
  const priorRequired = latestHeight < unlockAt ? priorBalance : 0;

  const votesLockRequired = votes.reduce((result, voteItem) => {
    const { vote, referendumInfo } = voteItem;
    if (!referendumInfo) {
      return result;
    } else if (referendumInfo.ongoing) {
      const voteLock = getOnChainVoteLock(vote);
      return new BigNumber(result).plus(voteLock).toString();
    } else {
      const voteLock = getFinishedVoteLock(
        vote,
        referendumInfo,
        latestHeight,
        lockingPeriod,
      );
      return new BigNumber(result).plus(voteLock).toString();
    }
  }, 0);

  return BigNumber.max(
    priorRequired,
    votesLockRequired,
    delegatingRequired,
  ).toString();
}

export const totalReferendaLockRequiredSelector = createSelector(
  myReferendaVotingSelector,
  latestHeightSelector,
  referendaLockingPeriodSelector,
  (votingArr, latestHeight, lockingPeriod) => {
    const trackLocks = votingArr.map((voting) =>
      getEachTrackRequiredLock(voting, latestHeight, lockingPeriod),
    );
    return BigNumber.max(...trackLocks, 0).toString();
  },
);
