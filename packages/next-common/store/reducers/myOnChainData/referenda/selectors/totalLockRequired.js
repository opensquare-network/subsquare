import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import BigNumber from "bignumber.js";
import getTrackRequiredLock from "./utils/getTrackRequiredLock";

export const totalReferendaLockRequiredSelector = createSelector(
  myReferendaVotingSelector,
  latestHeightSelector,
  referendaLockingPeriodSelector,
  (votingArr, latestHeight, lockingPeriod) => {
    const trackLocks = votingArr.map((voting) =>
      getTrackRequiredLock(voting, latestHeight, lockingPeriod),
    );
    return BigNumber.max(...trackLocks, 0).toString();
  },
);
