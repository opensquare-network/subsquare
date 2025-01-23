import { getAssetHubApi } from "next-common/utils/assetHub";
import { useEffect, useState } from "react";

let nowApi = null;

export function useAssetHubApi() {
  const [api, setApi] = useState(nowApi);

  useEffect(() => {
    if (api) {
      return;
    }

    getAssetHubApi().then((value) => {
      nowApi = value;
      setApi(value);
    });
  }, [api]);

  return api;
}
