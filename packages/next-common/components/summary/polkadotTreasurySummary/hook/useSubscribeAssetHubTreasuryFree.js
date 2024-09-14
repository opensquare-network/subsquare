import { useState, useEffect } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeFellowshipTreasuryFree(address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, result } = useSubStorage("system", "account", [address], {
    api,
  });

  useEffect(() => {
    if (loading) return;

    const freeData = result?.data?.free?.toJSON() || 0;
    setFree(freeData);
    setIsLoading(loading);
  }, [loading, result]);

  return { free, isLoading };
}
