import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeAssetHubAssets(api, assetId, address) {
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
