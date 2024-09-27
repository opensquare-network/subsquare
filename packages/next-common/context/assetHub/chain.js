import { createContext, useContext } from "react";

const AssetHubChainContext = createContext();

export function AssetHubChainProvider({ children }) {
  return (
    <AssetHubChainContext.Provider
      value={process.env.NEXT_PUBLIC_ASSET_HUB_CHAIN}
    >
      {children}
    </AssetHubChainContext.Provider>
  );
}

export function useAssetHubChain() {
  return useContext(AssetHubChainContext);
}
