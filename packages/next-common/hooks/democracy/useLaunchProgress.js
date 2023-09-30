import useLaunchPeriod from "next-common/hooks/democracy/useLaunchPeriod";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useLaunchProgress() {
  const period = useLaunchPeriod();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const goneBlocks = blockHeight % period;
  if (!period) {
    return null;
  }

  return new BigNumber(goneBlocks).div(period).multipliedBy(100).toNumber();
}
