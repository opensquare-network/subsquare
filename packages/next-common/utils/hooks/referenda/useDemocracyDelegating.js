// copied from `useTrackDelegation`

import { useCallback, useEffect, useState } from "react";
import { getDemocracyDelegation } from "../../democracy/getDemocracyDelegation";
import useIsMounted from "../useIsMounted";

export default function useDemocracyDelegating(api, address) {
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = useCallback(async () => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    try {
      const delegating = await getDemocracyDelegation(api, address);
      if (isMounted.current) {
        setDelegating(delegating);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [api, isMounted, address]);

  useEffect(() => {
    setDelegating(null);
    refresh();
  }, [refresh]);

  return { delegating, isLoading, refresh };
}
