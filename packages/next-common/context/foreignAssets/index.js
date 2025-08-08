import { createContext, useContext, useMemo } from "react";
import useMyForeignAssets from "next-common/hooks/foreignAssets/useMyForeignAssets";

const ForeignAssetsContext = createContext(null);

export function MyForeignAssetsProvider({ children }) {
  const { assets, loading } = useMyForeignAssets();

  const contextValue = useMemo(() => {
    const count = loading ? 0 : assets?.length || 0;

    return {
      assets,
      loading,
      count,
    };
  }, [assets, loading]);

  return (
    <ForeignAssetsContext.Provider value={contextValue}>
      {children}
    </ForeignAssetsContext.Provider>
  );
}

export function useMyForeignAssetsContext() {
  return useContext(ForeignAssetsContext);
}
