import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

const myDemocracyDelegationsSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    return voting?.delegations || {};
  },
);

export default myDemocracyDelegationsSelector;
