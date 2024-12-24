import { createContext, useContext } from "react";
import useAllProxies from "../hooks/useAllProxies";
import useTransformProxiesData from "next-common/components/data/hooks/useTransformProxiesData";

const AllProxiesContext = createContext(null);

export function AllProxiesProvider({ children }) {
  const { proxies = [], loading: initialLoading } = useAllProxies();
  const { result: data, loading: isTransformProxiesLoading } =
    useTransformProxiesData(proxies, initialLoading);
  const total = data?.length || 0;

  return (
    <AllProxiesContext.Provider
      value={{
        data,
        total,
        loading: initialLoading || isTransformProxiesLoading,
      }}
    >
      {children}
    </AllProxiesContext.Provider>
  );
}

export function useAllProxiesContext() {
  return useContext(AllProxiesContext);
}
