import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState, useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import BigNumber from "bignumber.js";

function filterBountiesData(items) {
  return items.filter((item) => {
    const { isFunded, isCuratorProposed, isActive } = item?.bounty?.status || {};
    return isFunded || isCuratorProposed || isActive;
  });
}

export function useQueryBounties(api) {
  const [bounties, setBounties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loaded, value } = useCall(api?.derive.bounties?.bounties);

  useEffect(() => {
    if (!api || !loaded) {
      return;
    }

    const filteredData = filterBountiesData(value);

    setBounties(filteredData);
    setIsLoading(!loaded);
  }, [api, loaded, value]);

  return {
    bounties,
    bountiesCount: bounties?.length || 0,
    isLoading,
  };
}

export function useBountiesTotalBalance(bounties, api) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchBalances = useCallback(async () => {
    try {
      const balances = await Promise.all(
        bounties.map(async (bounty) => {
          const id = bounty?.index?.toJSON();
          if (!id) return new BigNumber(0);

          try {
            const response = await nextApi.fetch(`treasury/bounties/${id}`);
            const address = response?.result?.onchainData?.address;

            if (!address) {
              const metadataValue =
                response?.result?.onchainData?.meta?.value || 0;
              return new BigNumber(metadataValue);
            }

            const account = await api?.query?.system?.account(address);
            return new BigNumber(account?.data?.free?.toJSON()).plus(
              account?.data?.reserved?.toJSON(),
            );
          } catch (error) {
            throw new Error(
              `Error fetching balance for bounty index ${id}: ${error}`,
            );
          }
        }),
      );

      const total = balances.reduce(
        (acc, balance) => acc.plus(balance),
        new BigNumber(0),
      );
      setTotalBalance(total.toString());
    } catch (error) {
      throw new Error(`"Error fetching balances: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [bounties, api]);

  useEffect(() => {
    if (!api || !bounties || bounties?.length === 0) {
      return;
    }

    fetchBalances();
  }, [fetchBalances, api, bounties]);

  return {
    balance: totalBalance,
    isLoading,
  };
}
