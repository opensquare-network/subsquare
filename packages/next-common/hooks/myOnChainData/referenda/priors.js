import { useSelector } from "react-redux";
import { myReferendaPriorLocksSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import BigNumber from "bignumber.js";
import useChainOrScanHeight from "next-common/hooks/height";

export function useMyFilteredReferendaPriorLocks() {
  const priors = useSelector(myReferendaPriorLocksSelector);
  const latestHeight = useChainOrScanHeight();

  return (priors || []).filter((prior) => {
    const { unlockAt, balance } = prior;
    return unlockAt > latestHeight && new BigNumber(balance).gt(0);
  });
}
