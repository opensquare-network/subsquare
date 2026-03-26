import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { useEffect, useState } from "react";

export function useQueryAccountFreeWithPapi(papi, address) {
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!papi || !address) {
      return;
    }

    setIsLoading(true);
    papi.query.System.Account.getValue(address)
      .then((value) => {
        setFree(value?.data?.free?.toString?.() || 0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [papi, address]);

  return {
    free,
    isLoading,
  };
}

export function useQueryAssetHubTreasuryFreeWithPapi(address) {
  const papi = useAssetHubPapi();
  return useQueryAccountFreeWithPapi(papi, address);
}
