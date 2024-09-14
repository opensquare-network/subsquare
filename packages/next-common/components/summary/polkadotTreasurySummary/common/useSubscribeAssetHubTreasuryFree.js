import { useState, useEffect } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";

export function useSubscribeFellowshipTreasuryFree(address) {
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
        const res = await api.query.system.account(address);
        const freeData = res?.data?.free?.toJSON() || 0;
        setFree(freeData);
      } catch (error) {
        console.error("Error fetching asset info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetInfo();

    const interval = setInterval(fetchAssetInfo, 60000);

    return () => clearInterval(interval);
  }, [api, address]);

  return { free, isLoading };
}
