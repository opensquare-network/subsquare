import { createContext, useContext } from "react";
import useProfileRecievedProxies from "../hooks/useProfileRecievedProxies";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const RecievedProxiesContext = createContext(null);

export function RecievedProxiesProvider({ children }) {
  const address = useProfileAddress();
  const { proxies = [], loading } = useProfileRecievedProxies(address);
  const total = proxies?.length || 0;

  return (
    <RecievedProxiesContext.Provider
      value={{
        data: proxies,
        total,
        loading,
      }}
    >
      {children}
    </RecievedProxiesContext.Provider>
  );
}

export function useRecievedProxiesContext() {
  return useContext(RecievedProxiesContext);
}
