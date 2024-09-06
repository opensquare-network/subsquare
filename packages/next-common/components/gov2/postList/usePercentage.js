import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { useMemo } from "react";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function usePercentage(startHeight, period) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
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
  }, [latestHeight, startHeight, end, period]);
}
