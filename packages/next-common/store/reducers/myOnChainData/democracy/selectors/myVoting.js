import { myDemocracyVotingSelector } from "../myDemocracyVoting";
import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import getOngoingVoteLock from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/getOngoingVoteLock";

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
      const voteLock = getOngoingVoteLock(vote);
      return new BigNumber(result).plus(voteLock).toString();
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
      const voteLock = getOngoingVoteLock(vote);
      return new BigNumber(result).plus(voteLock).toString();
    }, 0);

    return BigNumber.max(votesLocked, prior.balance).toString();
  },
);

export const democracyVotesLengthSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return 0;
    }

    const { votes = [] } = voting;
    return votes.length;
  },
);
