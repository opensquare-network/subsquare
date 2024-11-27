import { createContext, useContext } from "react";
import useProfileOnChainProxies from "../hooks/useProfileOnChainProxies";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const MyProxiesContext = createContext(null);

export function MyProxiesProvider({ children }) {
  const address = useProfileAddress();
  const { proxies = [], loading } = useProfileOnChainProxies(address);
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
