import BigNumber from "bignumber.js";
import { useEffect, useMemo } from "react";
import useSortedForeignAssetMetadata from "./useForeignAssetsWithBalances";
import { useTotalCounts } from "./context/assetHubTabsProvider";
import DynamicForeignAssetsTable from "./dynamicForeignAssetsTable";
import useSubscribeMultiForeignAssetAccounts from "./useSubscribeMultiForeignAssetAccounts";

export default function SubscribedForeignAssetsList({ address, columnsDef }) {
  const sortedMetadata = useSortedForeignAssetMetadata();
  const [, setTotalCount] = useTotalCounts();
  const multiAccounts = useSubscribeMultiForeignAssetAccounts(
    sortedMetadata,
    address,
  );

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
          transferable: value.status?.isFrozen ? "0" : balance,
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
    <DynamicForeignAssetsTable
      assets={assetsWithBalance}
      columnsDef={columnsDef}
      loading={loading}
    />
  );
}
