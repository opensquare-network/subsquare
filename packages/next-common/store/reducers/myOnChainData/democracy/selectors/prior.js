import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

const myDemocracyPriorLockSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return null;
    }

    return voting.prior;
  },
);

export default myDemocracyPriorLockSelector;
