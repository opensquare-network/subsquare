import useLaunchPeriod from "next-common/hooks/democracy/useLaunchPeriod";
import BigNumber from "bignumber.js";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export default function useLaunchProgress() {
  const period = useLaunchPeriod();
  const blockHeight = useBlockHeight();
  const goneBlocks = blockHeight % period;
  if (!period) {
    return null;
  }

  return new BigNumber(goneBlocks).div(period).multipliedBy(100).toNumber();
}
