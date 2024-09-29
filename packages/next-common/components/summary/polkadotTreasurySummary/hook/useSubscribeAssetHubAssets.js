import { useState, useEffect } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { toPrecision } from "next-common/utils";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { loading: isLoadingAccount, result: account } = useSubStorage(
    "assets",
    "account",
    [assetId, address],
    { api },
  );
  const { loading: isLoadingMeta, result: meta } = useSubStorage(
    "assets",
    "metadata",
    [assetId],
    { api },
  );

  const loading = isLoadingAccount || isLoadingMeta;

  useEffect(() => {
    if (loading) return;

    const freeAsset = account?.toJSON()?.balance || 0;
    const decimals = meta?.toJSON()?.decimals || 0;
    setFree(toPrecision(freeAsset, decimals));
    setIsLoading(loading);
  }, [loading, account, meta]);

  return { free, isLoading };
}
