import { createSelector } from "@reduxjs/toolkit";
import { myReferendaTrackLocksSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";

export const maxTracksLockSelector = createSelector(
  myReferendaTrackLocksSelector,
  (trackLocks) => {
    return Math.max(...trackLocks.map((item) => item.locked));
  },
);
