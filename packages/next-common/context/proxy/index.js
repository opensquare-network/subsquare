import React, { useContext, useMemo } from "react";
import useQueryMyProxied from "next-common/hooks/useQueryMyProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";
import { useChainSettings } from "../chain";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const ProxiesContext = React.createContext(null);

function ServerProxiesProvider({ children, address }) {
  const { proxies, loading } = useQueryMyProxied(address);

  return (
    <ProxiesContext.Provider
      value={{
        address,
        proxies,
        isLoading: loading,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
}

function OnChainProxiesProvider({ children, address }) {
  const { proxies: allProxies, loading } = useAllOnChainProxies();
  const myProxied = useMemo(
    () =>
      allProxies.filter(
        (proxy) => isSameAddress(proxy.delegatee, address) && proxy.delay === 0,
      ),
    [allProxies, address],
  );

  return (
    <ProxiesContext.Provider
      value={{
        address,
        proxies: myProxied,
        isLoading: loading,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
}

export function GeneralProxiesProvider({ userAddress, children }) {
  const { modules: { proxy: { provider = "chain" } = {} } = {} } =
    useChainSettings();
  const realAddress = useRealAddress();
  const address = userAddress || realAddress;

  const { address: _address } = useContext(ProxiesContext) || {};
  if (address === _address) {
    return children;
  }

  return provider === "server" ? (
    <ServerProxiesProvider address={address}>{children}</ServerProxiesProvider>
  ) : (
    <OnChainProxiesProvider address={address}>
      {children}
    </OnChainProxiesProvider>
  );
}

export function useMyProxied() {
  return useContext(ProxiesContext) || {};
}
