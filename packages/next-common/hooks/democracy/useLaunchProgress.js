import useLaunchPeriod from "next-common/hooks/democracy/useLaunchPeriod";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";

export default function useLaunchProgress() {
  const period = useLaunchPeriod();
  const blockHeight = useSelector(latestHeightSelector);
  const goneBlocks = blockHeight % period;
  if (!period) {
    return null;
  }

  return new BigNumber(goneBlocks).div(period).multipliedBy(100).toNumber();
}
