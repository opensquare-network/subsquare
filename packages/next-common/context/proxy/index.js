import React, { useContext, useMemo } from "react";
import useQueryMyProxied from "next-common/hooks/useQueryMyProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";
import { useChainSettings } from "../chain";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

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
  const realAddress = useRealAddress();

  const myProxied = useMemo(
    () =>
      allProxies.filter(
        (proxy) =>
          isSameAddress(proxy.delegatee, realAddress) && proxy.delay === 0,
      ),
    [allProxies, realAddress],
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

export function GeneralProxiesProvider({ children }) {
  const { modules: { proxy: { provider = "chain" } = {} } = {} } =
    useChainSettings();

  const context = useContext(ProxiesContext);
  if (context) {
    return children;
  }

  return provider === "server" ? (
    <ServerProxiesProvider>{children}</ServerProxiesProvider>
  ) : (
    <OnChainProxiesProvider>{children}</OnChainProxiesProvider>
  );
}

export function useMyProxied() {
  return useContext(ProxiesContext) || {};
}
