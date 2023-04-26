import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import isNil from "lodash.isnil";
import { useMemo } from "react";

export default function usePercentage(startHeight, period) {
  const latestHeight = useSelector(latestHeightSelector);
  const end = startHeight + period;

  return useMemo(() => {
    if (isNil(latestHeight) || latestHeight <= startHeight) {
      return 0;
    }

    if (latestHeight >= end) {
      return 100;
    }

    const gone = latestHeight - startHeight;
    return Number((gone / period) * 100).toFixed(2);
  }, [latestHeight, startHeight, period]);
}
