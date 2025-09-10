import { createContext, useContext } from "react";
import useTransformProxiesData from "next-common/components/data/proxies/hooks/useTransformProxiesData";
import { hasProxiesGraphQL } from "next-common/utils/env/proxy";
import useAllGraphqlProxies from "next-common/hooks/useAllGraphqlProxies";
import useAllServerProxies from "next-common/hooks/useAllServerProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";
import useMergedProxies from "next-common/components/data/proxies/hooks/useMergedProxies";

const AllProxiesContext = createContext(null);

function InnerProvider({ children, proxies, initialLoading }) {
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

function GraphQLProxiesProvider({ children }) {
  const { proxies: serverProxies, loading: serverLoading } =
    useAllGraphqlProxies();
  const { proxies: onChainProxies, loading: onChainLoading } =
    useAllOnChainProxies();
  const { proxies, loading } = useMergedProxies({
    serverProxies,
    onChainProxies,
    serverLoading,
    onChainLoading,
  });

  return (
    <InnerProvider proxies={proxies} initialLoading={loading}>
      {children}
    </InnerProvider>
  );
}

function BackendApiProxiesProvider({ children }) {
  const { proxies: serverProxies, loading: serverLoading } =
    useAllServerProxies();
  const { proxies: onChainProxies, loading: onChainLoading } =
    useAllOnChainProxies();
  const { proxies, loading } = useMergedProxies({
    serverProxies,
    onChainProxies,
    serverLoading,
    onChainLoading,
  });

  return (
    <InnerProvider proxies={proxies} initialLoading={loading}>
      {children}
    </InnerProvider>
  );
}

export function AllProxiesProvider({ children }) {
  const hasGraphQL = hasProxiesGraphQL();

  if (hasGraphQL) {
    return <GraphQLProxiesProvider>{children}</GraphQLProxiesProvider>;
  }

  return <BackendApiProxiesProvider>{children}</BackendApiProxiesProvider>;
}

export function useAllProxiesContext() {
  return useContext(AllProxiesContext);
}
