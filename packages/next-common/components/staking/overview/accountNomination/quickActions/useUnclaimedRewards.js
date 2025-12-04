import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { BN } from "@polkadot/util";

/**
 * Hook to query unclaimed staking rewards for a nominator address
 * Following the implementation from polkadot.js apps
 */
export default function useUnclaimedRewards(address) {
  const api = useContextApi();
  const [data, setData] = useState({
    amount: new BN(0),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!api || !address) {
      setData({ amount: new BN(0), isLoading: false, error: null });
      return;
    }

    let cancelled = false;

    async function fetchUnclaimedRewards() {
      try {
        setData({ amount: new BN(0), isLoading: true, error: null });

        // Get historical eras (limit to last 84 eras to avoid performance issues)
        const MAX_ERAS = 84;
        const allEras = await api.derive.staking.erasHistoric();

        if (!allEras || allEras.length === 0) {
          if (!cancelled) {
            setData({ amount: new BN(0), isLoading: false, error: null });
          }
          return;
        }

        // Limit to recent eras
        const recentEras = allEras.slice(-1 * MAX_ERAS);

        // Get staking ledger to check which rewards have been claimed
        const ledgerOpt = await api.query.staking.ledger(address);
        const ledger = ledgerOpt.unwrapOr(null);

        if (!ledger) {
          if (!cancelled) {
            setData({ amount: new BN(0), isLoading: false, error: null });
          }
          return;
        }

        // Get claimed rewards (combines legacy and current claimed rewards)
        const claimedRewards = [
          ...(ledger.legacyClaimedRewards || ledger.claimedRewards || []),
        ];

        // Filter out eras that have already been claimed
        const unclaimedEras = recentEras.filter(
          (era) => !claimedRewards.some((claimed) => era.eq(claimed)),
        );

        if (unclaimedEras.length === 0) {
          if (!cancelled) {
            setData({ amount: new BN(0), isLoading: false, error: null });
          }
          return;
        }

        // Calculate total unclaimed rewards
        let totalUnclaimed = new BN(0);

        // Query rewards for each era individually to avoid timeout
        // Using Promise.all to query in parallel but with smaller batches
        const rewardPromises = unclaimedEras.map((era) =>
          api.derive.staking.stakerRewards(address, era).catch((err) => {
            console.warn(
              `Failed to fetch rewards for era ${era.toString()}:`,
              err,
            );
            return null;
          }),
        );

        const rewards = await Promise.all(rewardPromises);
        console.log(":::rewards", rewards);

        // Sum up all unclaimed rewards
        rewards.forEach((reward) => {
          if (reward && !reward.eraReward.isZero()) {
            // Sum up all validator rewards for this nominator
            Object.values(reward.validators || {}).forEach(
              (validatorReward) => {
                if (validatorReward?.value) {
                  totalUnclaimed = totalUnclaimed.add(validatorReward.value);
                }
              },
            );
          }
        });

        if (!cancelled) {
          setData({
            amount: totalUnclaimed,
            isLoading: false,
            error: null,
          });
        }
      } catch (e) {
        console.error("Error fetching unclaimed rewards:", e);
        if (!cancelled) {
          setData({
            amount: new BN(0),
            isLoading: false,
            error: e.message,
          });
        }
      }
    }

    fetchUnclaimedRewards();

    return () => {
      cancelled = true;
    };
  }, [api, address]);

  return data;
}
