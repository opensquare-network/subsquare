import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

const myDemocracyDelegatedSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    if (!voting) {
      return 0;
    }

    const { isDelegating, balance } = voting;
    return isDelegating ? balance : 0;
  },
);

export default myDemocracyDelegatedSelector;
