import { useAssetHubApi } from "next-common/context/assetHub";
import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";

const { createContext, useContext } = require("react");

const AssetHubOnPolkadotMetadataContext = createContext();

export default AssetHubOnPolkadotMetadataContext;

export function AssetHubOnPolkadotMetadataProvider({ children }) {
  const api = useAssetHubApi();
  const allMetadata = useQueryAllAssetMetadata(api);

  return (
    <AssetHubOnPolkadotMetadataContext.Provider value={allMetadata}>
      {children}
    </AssetHubOnPolkadotMetadataContext.Provider>
  );
}

export function useAssetHubOnPolkadotMetadata() {
  return useContext(AssetHubOnPolkadotMetadataContext);
}
