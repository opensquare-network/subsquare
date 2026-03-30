import { getAssetHubApi, getAssetHubPapi } from "next-common/utils/assetHub";
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

let nowPapi = null;

export function useAssetHubPapi() {
  const [api, setApi] = useState(nowPapi);

  useEffect(() => {
    if (api) {
      return;
    }

    getAssetHubPapi().then((value) => {
      nowPapi = value;
      setApi(value);
    });
  }, [api]);

  return api;
}
