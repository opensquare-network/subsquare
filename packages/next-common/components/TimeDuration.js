import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export default function TimeDuration({
  blocks = 0,
  showMonths = true,
  slice = 2,
}) {
  const blockTime = useSelector(blockTimeSelector);

  return useMemo(() => {
    const value = new BigNumber(blockTime).multipliedBy(blocks).toNumber();

    return formatTimeDuration(value, {
      showMonths,
      slice,
    });
  }, [blocks, blockTime]);
}
