import { useState, useEffect, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { BN } from "@polkadot/util";

// TODO: fix -> fetch uncliamed hook
function processStakerRewards(stakerRewards) {
  if (!stakerRewards || stakerRewards.length === 0) {
    return { amount: new BN(0), details: [], totalPayouts: 0 };
  }

  let totalRewards = new BN(0);
  const details = [];

  // Process each era's rewards
  stakerRewards.forEach((reward) => {
    // Skip if already claimed
    if (reward.isClaimed || reward.isEmpty) {
      return;
    }

    // Process each validator's reward
    Object.entries(reward.validators || {}).forEach(
      ([validatorId, validatorReward]) => {
        if (
          validatorReward &&
          validatorReward.value &&
          !validatorReward.value.isZero()
        ) {
          totalRewards = totalRewards.add(validatorReward.value);
          details.push({
            validatorId,
            era: reward.era.toNumber(),
          });
        }
      },
    );
  });

  return {
    amount: totalRewards,
    details,
    totalPayouts: details.length,
  };
}

/**
 * Hook to fetch unclaimed staking rewards for a nominator
 * Based on polkadot.js useOwnEraRewards implementation
 */
export default function useUnclaimedRewards(stashId, maxEras = 84) {
  const api = useContextApi();
  const [data, setData] = useState({
    amount: new BN(0),
    details: [],
    totalPayouts: 0,
    isLoading: true,
    error: null,
  });

  const fetchRewards = useCallback(async () => {
    if (!api?.derive?.staking || !stashId) {
      return;
    }

    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Get historical eras
      const allEras = await api.derive.staking.erasHistoric();
      console.log(":::::allEras", allEras, !allEras, allEras.length);

      if (!allEras || allEras.length === 0) {
        setData({
          amount: new BN(0),
          details: [],
          totalPayouts: 0,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Get the last N eras
      const filteredEras = allEras.slice(-1 * maxEras);
      console.log(":::::filteredEras", filteredEras);

      // Fetch rewards for these eras
      const stakerRewards = await api.derive.staking.stakerRewardsMultiEras(
        [stashId],
        filteredEras,
      );
      console.log(":::::stakerRewards", stakerRewards);

      // Process the rewards
      const result = processStakerRewards(stakerRewards?.[0] || []);

      setData({
        ...result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch unclaimed rewards:", error);
      setData({
        amount: new BN(0),
        details: [],
        totalPayouts: 0,
        isLoading: false,
        error: error.message || "Failed to fetch rewards",
      });
    }
  }, [api, stashId, maxEras]);

  useEffect(() => {
    let cancelled = false;

    fetchRewards().then(() => {
      if (cancelled) {
        return;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fetchRewards]);

  return data;
}
