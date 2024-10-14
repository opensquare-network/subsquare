import React from "react";
import useQueryMyProxied from "next-common/hooks/useQueryMyProxies";

const OnChainProxiesContext = React.createContext(null);

export function OnChainProxiesProvider({ children }) {
  const { proxies, loading } = useQueryMyProxied();

  return (
    <OnChainProxiesContext.Provider
      value={{
        proxies,
        isLoading: loading,
      }}
    >
      {children}
    </OnChainProxiesContext.Provider>
  );
}

export function useMyProxied() {
  return React.useContext(OnChainProxiesContext);
}
