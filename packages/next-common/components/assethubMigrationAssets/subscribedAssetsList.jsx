import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo } from "react";
import useSortedAssetMetadata from "./useAssetsWithBalances";
import { useTotalCounts } from "./context/assetHubTabsProvider";
import DynamicAssetsTable from "./dynamicAssetsTable";
import useSubscribeMultiAssetAccounts from "next-common/utils/hooks/useSubscribeMultiAssetAccounts";

export default function SubscribedAssetsList({ address, columnsDef }) {
  const api = useContextApi();
  const sortedMetadata = useSortedAssetMetadata();
  const [, setTotalCount] = useTotalCounts();
  const multiAccountKey = useMemo(() => {
    if (!sortedMetadata || !address) {
      return null;
    }

    return sortedMetadata.map((asset) => [asset.assetId, address]);
  }, [address, sortedMetadata]);
  const multiAccounts = useSubscribeMultiAssetAccounts(multiAccountKey, api);

  const assetsWithBalance = useMemo(() => {
    if (!sortedMetadata || !multiAccounts) {
      return [];
    }

    return sortedMetadata.reduce((assets, asset, index) => {
      const account = multiAccounts[index];
      if (!account || account.isNone) {
        return assets;
      }

      const value = account.unwrap();
      const balance = value.balance?.toString?.() || "0";
      if (new BigNumber(balance).isZero()) {
        return assets;
      }

      return [
        ...assets,
        {
          ...asset,
          balance,
          transferrable: value.status?.isFrozen ? "0" : balance,
        },
      ];
    }, []);
  }, [multiAccounts, sortedMetadata]);

  const loading =
    !sortedMetadata || (sortedMetadata.length > 0 && !multiAccounts);

  useEffect(() => {
    if (!loading) {
      setTotalCount("assets", assetsWithBalance.length);
    }
  }, [assetsWithBalance.length, loading, setTotalCount]);

  return (
    <DynamicAssetsTable
      assets={assetsWithBalance}
      columnsDef={columnsDef}
      loading={loading}
    />
  );
}
