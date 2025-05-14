import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "../myReferendaVoting";
import getOnChainVoteLock from "next-common/hooks/myOnChainData/referenda/utils/getOnChainVoteLock";
import BigNumber from "bignumber.js";

function getVotingLock(voting) {
  const { isDelegating, balance, votes = [], prior } = voting;
  let votesLocked;
  if (isDelegating) {
    votesLocked = balance;
  } else {
    votesLocked = votes.reduce((result, { vote }) => {
      const voteLock = getOnChainVoteLock(vote);
      return BigNumber.max(result, voteLock).toString();
    }, 0);
  }

  return BigNumber.max(votesLocked, prior.balance).toString();
}

export const referendaLockFromOnChainDataSelector = createSelector(
  myReferendaVotingSelector,
  (votingArr) => {
    const locksByTrack = votingArr.map((voting) => getVotingLock(voting));
    return BigNumber.max(...locksByTrack, 0).toString();
  },
);
