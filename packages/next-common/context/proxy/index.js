import useCall from "next-common/utils/hooks/useCall";
import React, { useMemo } from "react";
import { useContextApi } from "../api";
import { flatten } from "lodash-es";
import { useUser } from "../user";

const OnChainProxiesContext = React.createContext(null);

export function OnChainProxiesProvider({ children }) {
  const api = useContextApi();
  const { value: proxies, loading } = useCall(
    api?.query?.proxy?.proxies?.entries,
    [],
  );
  const flattenedProxies = useMemo(() => {
    return flatten(
      (proxies || []).map(([key, value]) =>
        (value[0] || []).map((delegatee) => ({
          delegator: key.args?.[0]?.toString(),
          delegatee: delegatee.delegate?.toString(),
          proxyType: delegatee.proxyType?.toString(),
          delay: delegatee.delay?.toNumber(),
        })),
      ),
    );
  }, [proxies]);

  return (
    <OnChainProxiesContext.Provider
      value={{
        proxies: flattenedProxies,
        isLoading: loading,
      }}
    >
      {children}
    </OnChainProxiesContext.Provider>
  );
}

export function useProxies() {
  return React.useContext(OnChainProxiesContext);
}

export function useMyProxied() {
  const { proxies, isLoading } = useProxies();
  const user = useUser();

  const value = useMemo(() => {
    return proxies?.filter(
      (proxy) => proxy.delegatee === user?.address && proxy.delay === 0,
    );
  }, [proxies, user]);

  return {
    value,
    isLoading,
  };
}
