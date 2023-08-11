import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import BigNumber from "bignumber.js";

function getTrackDelegated(voting) {
  const { isDelegating, balance } = voting;
  return isDelegating ? balance : 0;
}

const myReferendaDelegatedSelector = createSelector(
  myReferendaVotingSelector,
  (trackVotingArr) => {
    const delegatedBalances = trackVotingArr.map(getTrackDelegated);
    return BigNumber.max(...delegatedBalances, 0).toString();
  },
);

export default myReferendaDelegatedSelector;
