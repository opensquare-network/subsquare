import { createContext, useContext } from "react";
import useQueryMythTokenBalance from "../hook/useQueryMythTokenBalance";

const MythTokenAssetsContext = createContext();

export const MythTokenAccount =
  "13gYFscwJFJFqFMNnttzuTtMrApUEmcUARtgFubbChU9g6mh";

export function MythTokenAssetsProvider({ children }) {
  const { isLoading, balance: mythTokenBalance } =
    useQueryMythTokenBalance(MythTokenAccount);

  return (
    <MythTokenAssetsContext.Provider
      value={{
        mythTokenBalance,
        isLoading,
      }}
    >
      {children}
    </MythTokenAssetsContext.Provider>
  );
}

export function useMythTokenAssets() {
  return useContext(MythTokenAssetsContext);
}
