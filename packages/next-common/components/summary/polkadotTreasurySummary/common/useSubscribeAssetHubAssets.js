import { useState, useEffect } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { toPrecision } from "next-common/utils";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, result } = useSubStorage(
    "assets",
    "account",
    [assetId, address],
    { api },
  );

  useEffect(() => {
    if (loading) return;

    const freeAsset = result?.toJSON()?.balance || 0;
    setFree(toPrecision(freeAsset, 6));
    setIsLoading(loading);
  }, [loading, result]);

  return { free, isLoading };
}
