import { isNil } from "lodash-es";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useRouter } from "next/router";
import { useChain } from "next-common/context/chain";
import { isKusamaChain } from "next-common/utils/chain";

function useIsKusamaFellowship() {
  const router = useRouter();
  const chain = useChain();

  return useMemo(
    () => router.pathname.includes("/fellowship") && isKusamaChain(chain),
    [router.pathname, chain],
  );
}

function useConditionalApi(indexer) {
  const [conditionalApi, setConditionalApi] = useState(null);
  const [blockApi, setBlockApi] = useState(null);
  const {
    relayChainEndpoints = [],
    endpoints = [],
    assethubMigration = {},
  } = useChainSettings();
  const isKusamaFellowship = useIsKusamaFellowship();

  const endpointUrls = useMemo(() => {
    if (isKusamaFellowship) {
      return relayChainEndpoints?.map?.((item) => item.url) || [];
    }

    const migrationBlockTime = assethubMigration?.timestamp || 0;
    if (
      !isNil(indexer) &&
      BigInt(indexer?.blockTime || 0) < BigInt(migrationBlockTime)
    ) {
      return relayChainEndpoints?.map?.((item) => item.url) || [];
    }

    return endpoints?.map?.((item) => item.url) || [];
  }, [
    assethubMigration?.timestamp,
    endpoints,
    indexer,
    isKusamaFellowship,
    relayChainEndpoints,
  ]);

  useEffect(() => {
    if (!endpointUrls || endpointUrls?.length === 0) {
      return;
    }

    getChainApi(endpointUrls).then(setConditionalApi);
  }, [endpointUrls]);

  useEffect(() => {
    if (!conditionalApi || isNil(indexer)) {
      return;
    }

    getChainApiAt(conditionalApi, indexer?.blockHeight).then(setBlockApi);
  }, [conditionalApi, indexer]);

  return isNil(indexer) ? conditionalApi : blockApi;
}

const ConditionalApiContext = createContext(null);

function DefaultContextApiProvider({ indexer, children }) {
  const [blockApi, setBlockApi] = useState(null);
  const contextApi = useContextApi();

  useEffect(() => {
    if (!contextApi || isNil(indexer)) {
      return;
    }

    getChainApiAt(contextApi, indexer?.blockHeight).then(setBlockApi);
  }, [contextApi, indexer]);

  const api = isNil(indexer) ? contextApi : blockApi;

  return (
    <ConditionalApiContext.Provider value={api}>
      {children}
    </ConditionalApiContext.Provider>
  );
}

function ConditionalContextApiProvider({ indexer, children }) {
  const api = useConditionalApi(indexer);

  return (
    <ConditionalApiContext.Provider value={api}>
      {children}
    </ConditionalApiContext.Provider>
  );
}

export function MigrationConditionalApiProvider({ indexer, children }) {
  if (isAssetHubMigrated()) {
    return (
      <ConditionalContextApiProvider indexer={indexer}>
        {children}
      </ConditionalContextApiProvider>
    );
  }

  return (
    <DefaultContextApiProvider indexer={indexer}>
      {children}
    </DefaultContextApiProvider>
  );
}

export function useConditionalContextApi() {
  const context = useContext(ConditionalApiContext);
  return context;
}
