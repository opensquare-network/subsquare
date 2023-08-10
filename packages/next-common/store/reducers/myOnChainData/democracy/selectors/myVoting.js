import { myDemocracyVotingSelector } from "../myDemocracyVoting";
import { createSelector } from "@reduxjs/toolkit";

export const myDemocracyDelegationLockSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting || !voting.isDelegating) {
      return 0;
    }

    return voting.balance;
  },
);
