import { myDemocracyVotingSelector } from "../myDemocracyVoting";
import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import getOnChainVoteLock from "./utils/getOngoingVoteLock";

export const democracyLockFromOnChainDataSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return 0;
    }

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
  },
);

export const democracyVotesLengthSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return 0;
    }

    const { votes = [], delegatedVotes = [] } = voting;
    return votes.length + delegatedVotes.length;
  },
);
