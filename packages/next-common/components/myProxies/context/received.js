import { createContext, useContext } from "react";
import useReceivedProxies from "next-common/hooks/useReceivedProxies";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const ReceivedProxiesContext = createContext(null);

export function ReceivedProxiesProvider({ children }) {
  const address = useRealAddress();
  const { proxies = [], loading } = useReceivedProxies(address);
  const total = proxies?.length || 0;

  return (
    <ReceivedProxiesContext.Provider
      value={{
        data: proxies,
        total,
        loading,
      }}
    >
      {children}
    </ReceivedProxiesContext.Provider>
  );
}

export function useReceivedProxiesContext() {
  return useContext(ReceivedProxiesContext);
}
