import useQueryAssetHubOnPolkadotMetadata from "../hook/useQueryAssetHubOnPolkadotMetadata";

const { createContext, useContext } = require("react");

const AssetHubOnPolkadotMetadataContext = createContext();

export default AssetHubOnPolkadotMetadataContext;

export function AssetHubOnPolkadotMetadataProvider({ children }) {
  const allMetadata = useQueryAssetHubOnPolkadotMetadata();

  return (
    <AssetHubOnPolkadotMetadataContext.Provider value={allMetadata}>
      {children}
    </AssetHubOnPolkadotMetadataContext.Provider>
  );
}

export function useAssetHubOnPolkadotMetadata() {
  return useContext(AssetHubOnPolkadotMetadataContext);
}
