import { isNil } from "lodash-es";
import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { getMetadata, setMetadata } from "next-common/utils/papiMetadataCache";
import { useChainSettings } from "next-common/context/chain";
import { useContextPapi } from "next-common/context/papi";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { useRouter } from "next/router";
import { useChain } from "next-common/context/chain";
import { isKusamaChain } from "next-common/utils/chain";
import BlockPapi from "next-common/utils/papiUtils/blockPapi.mjs";

const getPapi = async (endpoint, blockHash = null) => {
  const wsProvider = getWsProvider(endpoint);
  const client = await createClient(wsProvider, {
    getMetadata,
    setMetadata,
    ...(blockHash && { at: blockHash }),
  });
  const api = client.getUnsafeApi();
  return {
    api,
    client,
  };
};

function useIsKusamaFellowship() {
  const router = useRouter();
  const chain = useChain();

  return useMemo(
    () => router.pathname.includes("/fellowship") && isKusamaChain(chain),
    [router.pathname, chain],
  );
}

function useConditionalPapi(indexer) {
  const [conditionalData, setConditionalData] = useState({
    api: null,
    client: null,
  });
  const [blockData, setBlockData] = useState({ api: null, client: null });
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

    getPapi(endpointUrls[0]).then(setConditionalData);
  }, [endpointUrls]);

  useEffect(() => {
    if (!conditionalData || isNil(indexer)) {
      return;
    }

    setBlockData({
      ...conditionalData,
      api: new BlockPapi(conditionalData.api, indexer?.blockHash),
    });
  }, [conditionalData, indexer]);

  return isNil(indexer) ? conditionalData : blockData;
}

const ConditionalPapiContext = createContext(null);

function DefaultContextPapiProvider({ indexer, children }) {
  const [blockApi, setBlockApi] = useState(null);
  const { api: contextApi, client: contextClient } = useContextPapi();

  useEffect(() => {
    if (!contextApi || isNil(indexer)) {
      return;
    }
    setBlockApi(new BlockPapi(contextApi, indexer?.blockHash));
  }, [contextApi, indexer]);

  const data = isNil(indexer)
    ? { api: contextApi, client: contextClient }
    : { api: blockApi, client: contextClient };

  return (
    <ConditionalPapiContext.Provider value={data}>
      {children}
    </ConditionalPapiContext.Provider>
  );
}

function ConditionalContextPapiProvider({ indexer, children }) {
  const data = useConditionalPapi(indexer);

  return (
    <ConditionalPapiContext.Provider value={data}>
      {children}
    </ConditionalPapiContext.Provider>
  );
}

export function MigrationConditionalPapiProvider({ indexer, children }) {
  if (isAssetHubMigrated()) {
    return (
      <ConditionalContextPapiProvider indexer={indexer}>
        {children}
      </ConditionalContextPapiProvider>
    );
  }

  return (
    <DefaultContextPapiProvider indexer={indexer}>
      {children}
    </DefaultContextPapiProvider>
  );
}

export function useConditionalContextPapi() {
  const context = useContext(ConditionalPapiContext);
  return context;
}
