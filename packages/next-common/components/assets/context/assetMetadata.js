import useQueryAllAssetMetadata from "next-common/hooks/assets/useQueryAllAssetMetadata";
import { useContextApi } from "next-common/context/api";

const { createContext, useContext } = require("react");

const AssetMetadataContext = createContext();

export default AssetMetadataContext;

export function AssetMetadataProvider({ children }) {
  const api = useContextApi();
  const allMetadata = useQueryAllAssetMetadata(api);

  return (
    <AssetMetadataContext.Provider value={allMetadata}>
      {children}
    </AssetMetadataContext.Provider>
  );
}

export function useAllAssetMetadata() {
  return useContext(AssetMetadataContext);
}
