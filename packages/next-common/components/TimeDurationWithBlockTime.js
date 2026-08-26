import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export default function TimeDurationWithBlockTime({
  blocks = 0,
  blockTime,
  showMonths = true,
  slice = 2,
}) {
  return useMemo(() => {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();

    return formatTimeDuration(value, {
      showMonths,
      slice,
    });
  }, [blocks, blockTime, showMonths, slice]);
}
