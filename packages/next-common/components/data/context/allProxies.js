import { createContext, useContext } from "react";
import useAllProxies from "../hooks/useAllProxies";

const AllProxiesContext = createContext(null);

export function AllProxiesProvider({ children }) {
  const { proxies = [], loading } = useAllProxies();
  const total = proxies?.length || 0;

  return (
    <AllProxiesContext.Provider
      value={{
        data: proxies,
        total,
        loading,
      }}
    >
      {children}
    </AllProxiesContext.Provider>
  );
}

export function useAllProxiesContext() {
  return useContext(AllProxiesContext);
}
