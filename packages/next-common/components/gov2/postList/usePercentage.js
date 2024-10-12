import { isNil } from "lodash-es";
import { useMemo } from "react";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export default function usePercentage(startHeight, period) {
  const latestHeight = useBlockHeight();
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
