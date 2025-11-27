import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";

export function useRewardClaimable() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [claimable, setClaimable] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setLoading(true);
    api?.call?.nominationPoolsApi
      ?.pendingRewards(realAddress)
      .then((pendingRewards) => {
        const claimable = BigNumber(pendingRewards);
        setClaimable(claimable);
      })
      .finally(() => setLoading(false));
  }, [api, realAddress]);

  return { claimable, loading };
}
