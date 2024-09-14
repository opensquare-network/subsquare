import { useState, useEffect } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { toPrecision } from "next-common/utils";

export function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    const fetchAssetInfo = async () => {
      setIsLoading(true);
      try {
        const data = await api.query.assets.account(assetId, address);
        const freeAsset = data?.toJSON()?.balance || 0;
        setFree(toPrecision(freeAsset, 6));
      } catch (error) {
        console.error("Error fetching asset info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetInfo();

    const interval = setInterval(fetchAssetInfo, 60000);

    return () => clearInterval(interval);
  }, [api, assetId, address]);

  return { free, isLoading };
}
