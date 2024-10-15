import React, { useMemo } from "react";
import useQueryMyProxied from "next-common/hooks/useQueryMyProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";
import { useUser } from "../user";

const ProxiesContext = React.createContext(null);

export function ServerProxiesProvider({ children }) {
  const { proxies, loading } = useQueryMyProxied();

  return (
    <ProxiesContext.Provider
      value={{
        proxies,
        isLoading: loading,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
}

export function OnChainProxiesProvider({ children }) {
  const { proxies: allProxies, loading } = useAllOnChainProxies();
  const user = useUser();

  const myProxied = useMemo(
    () =>
      allProxies.filter(
        (proxy) => proxy.delegatee === user?.address && proxy.delay === 0,
      ),
    [allProxies, user?.address],
  );

  return (
    <ProxiesContext.Provider
      value={{
        proxies: myProxied,
        isLoading: loading,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
}

export function useMyProxied() {
  return React.useContext(ProxiesContext);
}
