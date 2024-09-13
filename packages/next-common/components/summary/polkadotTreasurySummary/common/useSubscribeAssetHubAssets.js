import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useAssetHubApi } from "next-common/context/assetHub";

export function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();
  const [free, setFree] = useState(0);

  const { loading } = useSubStorage("assets", "account", [assetId, address], {
    api,
    callback: useCallback((data) => {
      const free = data?.toJSON();
      setFree(free);
    }, []),
  });

  return { free, isLoading: loading };
}
