import { useSelector } from "react-redux";
import { myReferendaPriorLocksSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import BigNumber from "bignumber.js";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export function useMyFilteredReferendaPriorLocks() {
  const priors = useSelector(myReferendaPriorLocksSelector);
  const latestHeight = useAhmLatestHeight();

  return (priors || []).filter((prior) => {
    const { unlockAt, balance } = prior;
    return unlockAt > latestHeight && new BigNumber(balance).gt(0);
  });
}
