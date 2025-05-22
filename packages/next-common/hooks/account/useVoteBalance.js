import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { useTotalReferendaLockRequired } from "next-common/hooks/myOnChainData/referenda/totalLockRequired";

export default function useVoteBalance() {
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);
  const lockRequired = useTotalReferendaLockRequired();
  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  return {
    lockedBalance: locked,
    unlockBalance: BigNumber(locked).minus(lockRequired).toString(),
  };
}
