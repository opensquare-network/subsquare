import { getAssetHubApi } from "next-common/utils/assetHub";
import { createContext, useContext, useEffect, useState } from "react";

const AssetHubApiContext = createContext(null);

export function AssetHubApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getAssetHubApi().then(setApi);
  }, []);

  return (
    <AssetHubApiContext.Provider value={api}>
      {children}
    </AssetHubApiContext.Provider>
  );
}

export function useAssetHubApi() {
  return useContext(AssetHubApiContext);
}
