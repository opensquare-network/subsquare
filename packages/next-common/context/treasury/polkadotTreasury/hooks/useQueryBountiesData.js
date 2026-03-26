import { useCallback, useEffect, useState } from "react";
import { backendApi } from "next-common/services/nextApi";
import BigNumber from "bignumber.js";
import { querySystemAccountBalanceWithPapi } from "next-common/utils/hooks/useAddressBalance";
import bigAdd from "next-common/utils/math/bigAdd";
import { isNil } from "lodash-es";

function filterBountiesData(items) {
  return items.filter((item) => {
    const status = item?.status?.type;
    return ["Funded", "CuratorProposed", "Active"].includes(status);
  });
}

export function useQueryBounties(papi) {
  const [bounties, setBounties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!papi) {
      return;
    }

    setIsLoading(true);
    papi.query.Bounties.Bounties.getEntries()
      .then((entries) => {
        const filteredData = filterBountiesData(
          entries.map(({ keyArgs, value }) => ({
            index: keyArgs?.[0],
            ...value,
          })),
        );
        setBounties(filteredData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [papi]);

  return {
    bounties,
    bountiesCount: bounties?.length || 0,
    isLoading,
  };
}

export function useBountiesTotalBalance(bounties, papi) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchBalances = useCallback(async () => {
    try {
      const balances = await Promise.all(
        bounties.map(async (bounty) => {
          const id = bounty?.index;
          if (isNil(id)) {
            return new BigNumber(0);
          }

          try {
            const response = await backendApi.fetch(`treasury/bounties/${id}`);
            const address = response?.result?.onchainData?.address;

            if (!address) {
              const metadataValue =
                response?.result?.onchainData?.meta?.value || 0;
              return new BigNumber(metadataValue);
            }

            return await querySystemAccountBalanceWithPapi(papi, address);
          } catch (error) {
            throw new Error(
              `Error fetching balance for bounty index ${id}: ${error}`,
            );
          }
        }),
      );

      const total = balances.reduce((acc, balance) => bigAdd(acc, balance), 0);
      setTotalBalance(total);
    } catch (error) {
      throw new Error(`"Error fetching balances: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [bounties, papi]);

  useEffect(() => {
    if (!papi || !bounties || bounties?.length === 0) {
      return;
    }

    fetchBalances();
  }, [fetchBalances, papi, bounties]);

  return {
    balance: totalBalance,
    isLoading,
  };
}
