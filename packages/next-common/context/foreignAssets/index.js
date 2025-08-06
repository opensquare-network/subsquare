import { createContext, useContext, useMemo } from "react";
import useMyForeignAssets from "next-common/hooks/foreignAssets/useMyForeignAssets";

const ForeignAssetsContext = createContext(null);

export function MyForeignAssetsProvider({ children }) {
  const { assets, loading } = useMyForeignAssets();

  const count = useMemo(() => {
    if (loading) {
      return 0;
    }

    return assets?.length || 0;
  }, [assets, loading]);

  return (
    <ForeignAssetsContext.Provider value={{ assets, loading, count }}>
      {children}
    </ForeignAssetsContext.Provider>
  );
}

export function useMyForeignAssetsContext() {
  return useContext(ForeignAssetsContext);
}
