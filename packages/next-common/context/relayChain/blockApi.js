import { useRelayChainEndpoints } from "next-common/hooks/useRelayChain";
import { createContext, useContext, useEffect, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";

const RelayChainBlockApiContext = createContext(null);

function useRelayChainApi() {
  const endpointUrls = useRelayChainEndpoints();
  const [relayChainApi, setRelayChainApi] = useState(null);

  useEffect(() => {
    if (endpointUrls?.length) {
      getChainApi(endpointUrls).then(setRelayChainApi);
    }
  }, [endpointUrls]);

  return relayChainApi;
}

function useBlockHeightOrHashApi(relayChainApi, blockHeightOrHash) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (relayChainApi) {
      getChainApiAt(relayChainApi, blockHeightOrHash).then(setApi);
    }
  }, [blockHeightOrHash, relayChainApi]);

  return api;
}

export function RelayChainBlockApiProvider({ children, blockHeightOrHash }) {
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
