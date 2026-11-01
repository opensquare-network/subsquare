import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useRef, useState } from "react";

export function useRewardClaimable() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [claimable, setClaimable] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const nominationPoolsApi = api?.call?.nominationPoolsApi;
    if (!nominationPoolsApi?.pendingRewards || !realAddress) {
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const pendingRewards = await nominationPoolsApi.pendingRewards(
        realAddress,
      );
      if (requestId !== requestIdRef.current) {
        return;
      }
      setClaimable(BigInt(pendingRewards));
    } catch (e) {
      console.error("Failed to fetch pending pool rewards", e);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [api, realAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { claimable, loading, refresh };
}
