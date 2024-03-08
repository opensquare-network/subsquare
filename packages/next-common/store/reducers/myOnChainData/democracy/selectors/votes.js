import { createSelector } from "@reduxjs/toolkit";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { orderBy } from "lodash-es";

const myDemocracyVotesSelector = createSelector(
  myDemocracyVotingSelector,
  (voting) => {
    const votes = voting?.votes || [];
    return orderBy(votes, ["referendumIndex"], ["desc"]);
  },
);

export default myDemocracyVotesSelector;
