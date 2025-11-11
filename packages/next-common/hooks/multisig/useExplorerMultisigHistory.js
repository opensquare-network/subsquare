import {
  fetchMultisigAddresses,
  fetchMergedMultisigAddresses,
} from "next-common/services/multisig";
import { useAsync } from "react-use";
import { useMemo } from "react";
import getMultisigApiUrl from "next-common/services/multisig/url";
import { useChainSettings } from "next-common/context/chain";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export default function useExplorerMultisigHistory(
  chain,
  address,
  page = 1,
  pageSize = 10,
) {
  const chainSettings = useChainSettings();
  const { value: allData, loading } = useAsync(async () => {
    if (!isAssetHubMigrated() && !chainSettings?.relayChainMultisigApiPrefix) {
      const { result } = await fetchMultisigAddresses(
        getMultisigApiUrl(chain),
        address,
        1,
        100,
      );
      return result?.data?.multisigAddresses;
    }

    const { result } = await fetchMergedMultisigAddresses(chain, address);
    return result?.data?.multisigAddresses;
  }, [chain, address, chainSettings]);

  const paginatedData = useMemo(() => {
    if (!allData?.multisigAddresses) {
      return {
        items: [],
        total: 0,
      };
    }

    const allItems = allData.multisigAddresses;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      items: allItems.slice(startIndex, endIndex),
      total: allItems.length,
    };
  }, [allData, page, pageSize]);

  return {
    loading,
    total: paginatedData.total,
    items: paginatedData.items,
  };
}
