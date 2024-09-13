import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useAssetHubApi } from "next-common/context/assetHub";

export function useSubscribeFellowshipTreasuryFree(address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);

  useSubStorage("system", "account", [address], {
    api,
    callback: useCallback((accountData) => {
      const free = accountData.data.free.toJSON();
      setFree(free);
    }, []),
  });

  return { free, isLoading: false };
}
