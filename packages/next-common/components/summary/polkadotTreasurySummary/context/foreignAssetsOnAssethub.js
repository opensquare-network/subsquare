import { createContext, useContext } from "react";
import useQueryAssetHubForeignAssets from "next-common/hooks/assetHub/useQueryAssetHubForeignAssets";

const ForeignAssetsContext = createContext();

export const MythTokenAccount = "13gYFscwJFJFqFMNnttzuTtMrApUEmcUARtgFubbChU9g6mh";

export function ForeignAssetsProvider({ children }) {
  const { isLoading, balance: mythTokenBalance } =
    useQueryAssetHubForeignAssets(MythTokenAccount);

  return (
    <ForeignAssetsContext.Provider
      value={{
        mythTokenBalance,
        isLoading,
      }}
    >
      {children}
    </ForeignAssetsContext.Provider>
  );
}

export function useForeignAssets() {
  return useContext(ForeignAssetsContext);
}
