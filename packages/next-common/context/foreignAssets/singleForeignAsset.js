import { createContext, useContext, useEffect, useState } from "react";
import useSubForeignAsset from "next-common/hooks/foreignAssets/useSubForeignAsset";

const SingleForeignAssetContext = createContext(null);

export function SingleForeignAssetProvider({ assetLocation, children }) {
  const { asset: realtimeAsset, loading } = useSubForeignAsset(assetLocation);
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    setAsset({
      balance: realtimeAsset?.balance || "0",
      transferable: realtimeAsset?.transferrable || "0",
    });
  }, [realtimeAsset, loading]);

  return (
    <SingleForeignAssetContext.Provider value={{ asset, loading }}>
      {children}
    </SingleForeignAssetContext.Provider>
  );
}

export function useSingleForeignAsset() {
  const context = useContext(SingleForeignAssetContext);
  return context;
}
