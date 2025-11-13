import { createContext, useContext, useEffect, useState } from "react";
import { getChainApiAt } from "next-common/utils/getChainApi";
import { RelayChainApiProvider, useRelayChainApi } from ".";
import { useRelayChainBlockNumber } from "next-common/utils/gov2/useRelayChainBlockNumber";

const RelayChainBlockApiContext = createContext(null);

function useBlockHeightOrHashApi(relayChainApi, blockHeightOrHash) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (relayChainApi) {
      getChainApiAt(relayChainApi, blockHeightOrHash).then(setApi);
    }
  }, [blockHeightOrHash, relayChainApi]);

  return api;
}

export function RelayChainBlockApiProvider({ children, blockHeight }) {
  return (
    <RelayChainApiProvider>
      <RelayChainBlockApiProviderImpl blockHeight={blockHeight}>
        {children}
      </RelayChainBlockApiProviderImpl>
    </RelayChainApiProvider>
  );
}

function RelayChainBlockApiProviderImpl({ children, blockHeight }) {
  const { relayChainBlockNumber: blockHeightOrHash } =
    useRelayChainBlockNumber(blockHeight);

  const relayChainApi = useRelayChainApi();
  const api = useBlockHeightOrHashApi(relayChainApi, blockHeightOrHash);

  useEffect(() => {
    return () => {
      if (relayChainApi) {
        relayChainApi.disconnect?.();
      }
    };
  }, [relayChainApi]);
  return (
    <RelayChainBlockApiContext.Provider value={api}>
      {children}
    </RelayChainBlockApiContext.Provider>
  );
}

export function useRelayChainBlockApi() {
  return useContext(RelayChainBlockApiContext);
}
