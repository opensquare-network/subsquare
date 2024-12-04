import { createContext, useContext } from "react";
import useSubMyProxies from "next-common/hooks/account/useSubMyProxies";

const MyProxiesContext = createContext(null);

export function MyProxiesProvider({ children }) {
  const { proxies = [], loading } = useSubMyProxies();
  const total = proxies[0]?.length || 0;

  return (
    <MyProxiesContext.Provider
      value={{
        proxies: proxies[0],
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