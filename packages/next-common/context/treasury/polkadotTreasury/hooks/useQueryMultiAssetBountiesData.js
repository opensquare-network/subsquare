import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { getAssetInfoFromPapiAssetKind } from "next-common/utils/treasury/multiAssetBounty/papiAssetKind";

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

export function useMultiAssetsBountiesTotalBalance(
  bounties,
  chainDecimals,
  chainSymbol,
) {
  const totalByAsset = useMemo(() => {
    if (!bounties?.length) {
      return {};
    }

    const result = {};
    bounties.forEach((bounty) => {
      const { symbol, decimals } = getAssetInfoFromPapiAssetKind(
        bounty?.asset_kind,
        chainDecimals,
        chainSymbol,
      );
      const amount = bounty?.value != null ? String(bounty.value) : "0";
      if (!result[symbol]) {
        result[symbol] = { symbol, decimals, total: new BigNumber(0) };
      }
      result[symbol].total = result[symbol].total.plus(amount);
    });
    return result;
  }, [bounties, chainDecimals, chainSymbol]);

  return { totalByAsset };
}
