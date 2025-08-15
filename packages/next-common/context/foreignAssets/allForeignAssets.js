import React, { createContext, useContext } from "react";
import useAllForeignAssets from "next-common/hooks/foreignAssets/useAllForeignAssets";

const AllForeignAssetsContext = createContext();

export function AllForeignAssetsProvider({ children }) {
  const { data: allForeignAssets, loading } = useAllForeignAssets();

  return (
    <AllForeignAssetsContext.Provider
      value={{
        allForeignAssets,
        loading,
      }}
    >
      {children}
    </AllForeignAssetsContext.Provider>
  );
}

export function useAllForeignAssetsContext() {
  return useContext(AllForeignAssetsContext);
}
