import useQueryAssetHubOnPolkadotMetadata from "../context/queryAssetHubOnPolkadotMetadata";

const { createContext, useContext } = require("react");

const AssetMetadataContext = createContext();

export default AssetMetadataContext;

export function AssetMetadataProvider({ children }) {
  const allMetadata = useQueryAssetHubOnPolkadotMetadata();

  return (
    <AssetMetadataContext.Provider value={allMetadata}>
      {children}
    </AssetMetadataContext.Provider>
  );
}

export function useAssetHubOnPolkadotMetadata() {
  return useContext(AssetMetadataContext);
}
