import { useEffect, useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { calculateAllErasRewardsBatch } from "./nominatorRewardsUtils";

export default function useNominatorUnClaimedRewards(nominatorAddress) {
  const api = useContextApi();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!api || !nominatorAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await calculateAllErasRewardsBatch(api, nominatorAddress);
      setResult(data);
    } catch (error) {
      setResult({ result: [], totalRewards: "0", details: [] });
    } finally {
      setLoading(false);
    }
  }, [api, nominatorAddress]);

  useEffect(() => {
    let cancelled = false;

    const runFetch = async () => {
      if (cancelled) return;
      await fetch();
    };

    runFetch();

    return () => {
      cancelled = true;
    };
  }, [fetch]);

  return { result, loading, fetch };
}
