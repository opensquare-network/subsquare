import { useSelector } from "react-redux";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import BigNumber from "bignumber.js";
import getTrackRequiredLock from "./utils/getTrackRequiredLock";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export function useTotalReferendaLockRequired() {
  const votingArr = useSelector(myReferendaVotingSelector);
  const latestHeight = useAhmLatestHeight();
  const lockingPeriod = useSelector(referendaLockingPeriodSelector);

  const trackLocks = votingArr.map((voting) =>
    getTrackRequiredLock(voting, latestHeight, lockingPeriod),
  );
  return BigNumber.max(...trackLocks, 0).toString();
}
