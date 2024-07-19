import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";

const { createContext, useContext } = require("react");

const AssetMetadataContext = createContext();

export default AssetMetadataContext;

export function AssetMetadataProvider({ children }) {
  const allMetadata = useQueryAllAssetMetadata();

  return (
    <AssetMetadataContext.Provider value={allMetadata}>
      {children}
    </AssetMetadataContext.Provider>
  );
}

export function useAllAssetMetadata() {
  return useContext(AssetMetadataContext);
}
