import { myDemocracyVotingSelector } from "../myDemocracyVoting";
import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

export const myDemocracyDelegationLockSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting || !voting.isDelegating) {
      return 0;
    }

    return voting.balance;
  },
);

export const myDemocracyVotingLockSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting || !voting.isDirect) {
      return 0;
    }

    const { votes } = voting;
    const ongoingVotes = votes.filter((vote) => {
      const { referendumInfo } = vote;
      return referendumInfo.ongoing;
    });

    return ongoingVotes.reduce((result, { vote }) => {
      const { isStandard, isSplit } = vote;
      if (isStandard) {
        return new BigNumber(result).plus(vote.balance).toString();
      } else if (isSplit) {
        return new BigNumber(result)
          .plus(vote.ayeBalance)
          .plus(vote.nayBalance)
          .toString();
      }

      return result;
    }, 0);
  },
);

export const democracyLockFromOnChainDataSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return 0;
    }

    const { votes, prior } = voting;
    const votesLocked = votes.reduce((result, { vote }) => {
      const { isStandard, isSplit } = vote;
      if (isStandard) {
        return new BigNumber(result).plus(vote.balance).toString();
      } else if (isSplit) {
        return new BigNumber(result)
          .plus(vote.ayeBalance)
          .plus(vote.nayBalance)
          .toString();
      }

      return result;
    }, 0);

    return BigNumber.max(votesLocked, prior.balance).toString();
  },
);
