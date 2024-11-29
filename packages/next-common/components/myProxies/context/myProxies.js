import { createContext, useContext } from "react";
import useMyOnChainProxies from "next-common/hooks/account/useMyOnChainProxies";

const MyProxiesContext = createContext(null);

export function MyProxiesProvider({ children }) {
  const { proxies = [], loading } = useMyOnChainProxies();
  const total = proxies[0]?.length || 0;

  return (
    <MyProxiesContext.Provider
      value={{
        data: proxies[0],
        total,
        loading,
      }}
    >
      {children}
    </MyProxiesContext.Provider>
  );
}

export function useMyProxiesContext() {
  return useContext(MyProxiesContext);
}
