import { isNil } from "lodash-es";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

const MIGRATION_BLOCK_TIME_MAP = {
  westend: 1747307424000,
};

function useConditionalApi(indexer) {
  const [conditionalApi, setConditionalApi] = useState(null);
  const [blockApi, setBlockApi] = useState(null);
  const chain = useChain();

  const { relayChainEndpoints = [], endpoints = [] } = useChainSettings();

  const endpointUrls = useMemo(() => {
    if (isNil(indexer) || !indexer?.blockTime) {
      return [];
    }

    const migrationBlockTime = MIGRATION_BLOCK_TIME_MAP[chain] || 0;
    const indexerBlockTime = BigInt(indexer?.blockTime || 0);
    const migrationBlockTimeBN = BigInt(migrationBlockTime);

    if (indexerBlockTime >= migrationBlockTimeBN) {
      return endpoints?.map?.((item) => item.url) || [];
    }

    return relayChainEndpoints?.map?.((item) => item.url) || [];
  }, [chain, endpoints, indexer, relayChainEndpoints]);

  useEffect(() => {
    if (!endpointUrls || endpointUrls?.length === 0) {
      return;
    }

    getChainApi(endpointUrls).then(setConditionalApi);
  }, [endpointUrls]);

  useEffect(() => {
    if (!conditionalApi || isNil(indexer?.finishHeight)) {
      return;
    }

    getChainApiAt(conditionalApi, indexer?.finishHeight).then(setBlockApi);
  }, [conditionalApi, indexer?.finishHeight]);

  return isNil(indexer?.finishHeight) ? conditionalApi : blockApi;
}

const ConditionalApiContext = createContext(null);

function DefaultContextApiProvider({ indexer, children }) {
  const [blockApi, setBlockApi] = useState(null);
  const contextApi = useContextApi();

  useEffect(() => {
    if (!contextApi || isNil(indexer?.finishHeight)) {
      return;
    }

    getChainApiAt(contextApi, indexer?.finishHeight).then(setBlockApi);
  }, [contextApi, indexer?.finishHeight]);

  const api = isNil(indexer?.finishHeight) ? contextApi : blockApi;

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
