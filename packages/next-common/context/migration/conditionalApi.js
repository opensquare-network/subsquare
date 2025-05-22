import { isNil } from "lodash-es";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

const MIGRATION_BLOCK_TIME_MAP = {
  westend: 1747307424000,
};

/**
 * Get conditional API
 * @param {Object} indexer - Indexer object
 * @param {number|string} [finishHeightOrHash] - Optional block height or hash
 * @returns {Object} Conditional API object
 */
function useConditionalApi(indexer, finishHeightOrHash) {
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
    if (!conditionalApi || isNil(finishHeightOrHash)) {
      return;
    }

    getChainApiAt(conditionalApi, finishHeightOrHash).then(setBlockApi);
  }, [conditionalApi, finishHeightOrHash]);

  return isNil(finishHeightOrHash) ? conditionalApi : blockApi;
}

const ConditionalApiContext = createContext(null);

function DefaultContextApiProvider({ finishHeightOrHash, children }) {
  const [blockApi, setBlockApi] = useState(null);
  const contextApi = useContextApi();

  useEffect(() => {
    if (!contextApi || isNil(finishHeightOrHash)) {
      return;
    }

    getChainApiAt(contextApi, finishHeightOrHash).then(setBlockApi);
  }, [contextApi, finishHeightOrHash]);

  const api = isNil(finishHeightOrHash) ? contextApi : blockApi;

  return (
    <ConditionalApiContext.Provider value={api}>
      {children}
    </ConditionalApiContext.Provider>
  );
}

function ConditionalContextApiProvider({
  indexer,
  finishHeightOrHash,
  children,
}) {
  const api = useConditionalApi(indexer, finishHeightOrHash);

  return (
    <ConditionalApiContext.Provider value={api}>
      {children}
    </ConditionalApiContext.Provider>
  );
}

export function MigrationConditionalApiProvider({
  indexer,
  finishHeightOrHash = null,
  children,
}) {
  if (isAssetHubMigrated()) {
    return (
      <ConditionalContextApiProvider
        indexer={indexer}
        finishHeightOrHash={finishHeightOrHash}
      >
        {children}
      </ConditionalContextApiProvider>
    );
  }

  return (
    <DefaultContextApiProvider finishHeightOrHash={finishHeightOrHash}>
      {children}
    </DefaultContextApiProvider>
  );
}

export function useConditionalApiContext() {
  const context = useContext(ConditionalApiContext);
  return context;
}
