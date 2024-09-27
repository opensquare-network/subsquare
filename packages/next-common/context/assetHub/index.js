import { AssetHubChainProvider, useAssetHubChain } from "./chain";
import { AssetHubApiProvider, useAssetHubApi } from "./api";

export function AssetHubProvider({ children }) {
  return (
    <AssetHubChainProvider>
      <AssetHubApiProvider>{children}</AssetHubApiProvider>
    </AssetHubChainProvider>
  );
}

export { useAssetHubApi, useAssetHubChain };
