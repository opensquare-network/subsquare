import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useState } from "react";

export default function useMyPool(rewardPools = false) {
  const [rewardLoading, setRewardLoading] = useState(false);
  const [result, setResult] = useState(null);
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { result: poolMember, loading: poolMemberLoading } = useSubStorage(
    "nominationPools",
    "poolMembers",
    [realAddress],
  );

  const getRewardResult = useCallback(
    async (jsonPoolMember) => {
      api?.call?.nominationPoolsApi
        ?.pendingRewards(realAddress)
        .then((pendingRewards) => {
          const claimable = BigNumber(pendingRewards);
          setResult({
            ...jsonPoolMember,
            claimable,
          });
        })
        .finally(() => setRewardLoading(false));
    },
    [api, realAddress],
  );

  useEffect(() => {
    if (!api || !(poolMember && !poolMember.isNone)) {
      return;
    }

    const jsonPoolMember = poolMember?.toJSON() || {};

    if (!rewardPools) {
      setResult(jsonPoolMember);
      return;
    }

    getRewardResult(poolMember?.toJSON() || {});
  }, [api, poolMember, rewardPools, getRewardResult]);

  return {
    result,
    loading: poolMemberLoading || rewardLoading,
  };
}
