import { useSelector } from "react-redux";
import {
  myReferendaTrackLocksSelector,
  myReferendaVotingSelector,
} from "../myReferendaVoting";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import getTrackRequiredLock from "./utils/getTrackRequiredLock";
import BigNumber from "bignumber.js";
import { orderBy } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";

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

export function useUnlockTracks() {
  const trackLocks = useSelector(myReferendaTrackLocksSelector);
  const trackVotingArr = useSelector(myReferendaVotingSelector);
  const latestHeight = useChainOrScanHeight();
  const lockingPeriod = useSelector(referendaLockingPeriodSelector);

  const sorted = orderBy(trackLocks, ["trackId"]);
  const tracksData = sorted.map((trackLock) => {
    const { trackId, locked } = trackLock;
    const voting = trackVotingArr.find((voting) => voting.trackId === trackId);

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
}
