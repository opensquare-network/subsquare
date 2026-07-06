import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { backendApi } from "next-common/services/nextApi";
import {
  getAssetInfoFromPapiAssetKind,
  extractPapiAssetId,
} from "next-common/utils/treasury/multiAssetBounty/papiAssetKind";
import { querySystemAccountBalanceWithPapi } from "next-common/utils/hooks/useAddressBalance";

const MULTI_ASSET_BOUNTY_ACTIVE_STATUS_TYPES = [
  "FundingAttempted",
  "Funded",
  "Active",
];

function filterActiveMultiAssetBounties(items) {
  return items.filter((item) =>
    MULTI_ASSET_BOUNTY_ACTIVE_STATUS_TYPES.includes(item?.status?.type),
  );
}

export function useQueryMultiAssetsBounties(papi, checkPallet) {
  const [bounties, setBounties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!papi) {
      return;
    }

    if (!checkPallet("MultiAssetBounties", "Bounties")) {
      setIsLoading(false);
      setBounties([]);
      return;
    }

    setIsLoading(true);
    papi.query.MultiAssetBounties.Bounties.getEntries()
      .then((entries) => {
        const all = entries.map(({ keyArgs, value }) => ({
          index: keyArgs?.[0],
          ...value,
        }));
        setBounties(filterActiveMultiAssetBounties(all));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [papi, checkPallet]);

  return {
    bounties,
    bountiesCount: bounties?.length ?? 0,
    isLoading,
  };
}

async function fetchSingleBountyBalance(
  bounty,
  papi,
  chainDecimals,
  chainSymbol,
) {
  const bountyIndex = bounty?.index;
  if (isNil(bountyIndex)) {
    return null;
  }

  const { symbol, decimals } = getAssetInfoFromPapiAssetKind(
    bounty?.asset_kind,
    chainDecimals,
    chainSymbol,
  );

  let balance;
  try {
    const response = await backendApi.fetch(
      `treasury/multi-asset-bounties/${bountyIndex}`,
    );
    const address = response?.result?.onchainData?.address;

    if (address) {
      const assetId = extractPapiAssetId(bounty?.asset_kind);
      if (!isNil(assetId)) {
        const account = await papi.query.Assets.Account.getValue(
          assetId,
          address,
        );
        balance = account?.balance?.toString?.() || "0";
      } else {
        balance = await querySystemAccountBalanceWithPapi(papi, address);
      }
    }
  } catch (e) {
    console.error(`Error fetching balance for bounty index ${bountyIndex}:`, e);
  }

  return { symbol, decimals, amount: balance ?? "0" };
}

export function useMultiAssetsBountiesTotalBalance(
  bounties,
  papi,
  chainDecimals,
  chainSymbol,
) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalByAsset, setTotalByAsset] = useState({});

  const fetchBalances = useCallback(async () => {
    if (!bounties?.length || !papi) {
      setTotalByAsset({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const results = await Promise.all(
        bounties.map((bounty) =>
          fetchSingleBountyBalance(bounty, papi, chainDecimals, chainSymbol),
        ),
      );

      const aggregated = {};
      for (const item of results) {
        if (!item) {
          continue;
        }
        const { symbol, decimals, amount } = item;
        if (!aggregated[symbol]) {
          aggregated[symbol] = { symbol, decimals, total: new BigNumber(0) };
        }
        aggregated[symbol].total = aggregated[symbol].total.plus(amount);
      }
      setTotalByAsset(aggregated);
    } catch (error) {
      console.error("Error fetching multi-asset bounty balances:", error);
      setTotalByAsset({});
    } finally {
      setIsLoading(false);
    }
  }, [bounties, papi, chainDecimals, chainSymbol]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { totalByAsset, isLoading };
}
