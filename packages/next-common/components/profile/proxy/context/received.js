import { createContext, useContext } from "react";
import useReceivedProxies from "next-common/hooks/useReceivedProxies";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const ReceivedProxiesContext = createContext(null);

export function ReceivedProxiesProvider({ children }) {
  const address = useProfileAddress();
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
