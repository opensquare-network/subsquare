import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!api || !(poolMember && !poolMember.isNone)) {
      return;
    }

    const jsonPoolMember = poolMember?.toJSON() || {};

    if (!rewardPools) {
      setResult(jsonPoolMember);
      return;
    }

    setRewardLoading(true);
    api?.query?.nominationPools
      ?.rewardPools?.(jsonPoolMember.poolId)
      .then((rewardResult) => {
        const jsonRewardResult = rewardResult?.toJSON() || {};
        const claimable = BigNumber(jsonPoolMember.lastRecordedRewardCounter)
          .minus(BigNumber(jsonRewardResult.lastRecordedRewardCounter))
          .times(jsonPoolMember.points);

        setResult({
          ...jsonPoolMember,
          claimable,
        });
      })
      .finally(() => setRewardLoading(false));
  }, [api, poolMember, rewardPools]);

  return {
    result,
    loading: poolMemberLoading || rewardLoading,
  };
}
