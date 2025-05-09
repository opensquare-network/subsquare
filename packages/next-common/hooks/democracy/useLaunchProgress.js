import useLaunchPeriod from "next-common/hooks/democracy/useLaunchPeriod";
import BigNumber from "bignumber.js";
import useChainOrScanHeight from "next-common/hooks/height";

export default function useLaunchProgress() {
  const period = useLaunchPeriod();
  const blockHeight = useChainOrScanHeight();
  const goneBlocks = blockHeight % period;
  if (!period) {
    return null;
  }

  return new BigNumber(goneBlocks).div(period).multipliedBy(100).toNumber();
}
