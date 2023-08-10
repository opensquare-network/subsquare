import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "../myReferendaVoting";
import getOnChainVoteLock from "./utils/getOnChainVoteLock";
import BigNumber from "bignumber.js";

function getVotingLock(voting) {
  const { isDelegating, balance, votes, prior } = voting;
  let votesLocked;
  if (isDelegating) {
    votesLocked = balance;
  } else {
    votesLocked = votes.reduce((result, { vote }) => {
      const voteLock = getOnChainVoteLock(vote);
      return new BigNumber(result).plus(voteLock).toString();
    }, 0);
  }

  return BigNumber.max(votesLocked, prior.balance).toString();
}

export const referendaLockFromOnChainDataSelector = createSelector(
  myReferendaVotingSelector,
  (votingArr) => {
    return votingArr.reduce((result, voting) => {
      return BigNumber.max(result, getVotingLock(voting)).toString();
    }, 0);
  },
);
