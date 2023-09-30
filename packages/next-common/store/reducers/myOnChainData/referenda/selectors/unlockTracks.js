import { createSelector } from "@reduxjs/toolkit";
import {
  myReferendaTrackLocksSelector,
  myReferendaVotingSelector,
} from "../myReferendaVoting";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import getTrackRequiredLock from "./utils/getTrackRequiredLock";
import BigNumber from "bignumber.js";
import orderBy from "lodash.orderby";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

function shouldUnlockTrack(trackData, latestHeight, lockingPeriod) {
  const { trackLock, voting } = trackData;
  if (!voting) {
    return true;
  }

  const requiredLock = getTrackRequiredLock(
    voting,
    latestHeight,
    lockingPeriod,
  );
  return new BigNumber(trackLock).gt(requiredLock);
}

const unlockTracksSelector = createSelector(
  myReferendaTrackLocksSelector,
  myReferendaVotingSelector,
  chainOrScanHeightSelector,
  referendaLockingPeriodSelector,
  (trackLocks, trackVotingArr, latestHeight, lockingPeriod) => {
    const sorted = orderBy(trackLocks, ["trackId"]);
    const tracksData = sorted.map((trackLock) => {
      const { trackId, locked } = trackLock;
      const voting = trackVotingArr.find(
        (voting) => voting.trackId === trackId,
      );

      return {
        trackId,
        trackLock: locked,
        voting,
      };
    });

    return tracksData
      .filter((trackData) =>
        shouldUnlockTrack(trackData, latestHeight, lockingPeriod),
      )
      .map((trackData) => trackData.trackId);
  },
);

export default unlockTracksSelector;
