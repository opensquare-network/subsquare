import { createContext, useContext } from "react";
import useMyForeignAssets from "next-common/hooks/foreignAssets/useMyForeignAssets";

const ForeignAssetsContext = createContext(null);

export function ForeignAssetsProvider({ children }) {
  const { assets, loading } = useMyForeignAssets();

  return (
    <ForeignAssetsContext.Provider value={{ assets, loading }}>
      {children}
    </ForeignAssetsContext.Provider>
  );
}

export function useForeignAssets() {
  return useContext(ForeignAssetsContext);
}
