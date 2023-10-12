import { createSelector } from "@reduxjs/toolkit";
import { myReferendaPriorLocksSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import BigNumber from "bignumber.js";

const myFilteredReferendaPriorLocksSelector = createSelector(
  myReferendaPriorLocksSelector,
  chainOrScanHeightSelector,
  (priors, latestHeight) => {
    return (priors || []).filter((prior) => {
      const { unlockAt, balance } = prior;
      return unlockAt > latestHeight && new BigNumber(balance).gt(0);
    });
  },
);

export default myFilteredReferendaPriorLocksSelector;
