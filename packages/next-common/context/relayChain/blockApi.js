import { useRelayChain } from "next-common/hooks/useRelayChain";
import getChainSettings from "next-common/utils/consts/settings";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getChainApi, getChainApiAt } from "next-common/utils/getChainApi";

const RelayChainBlockApiContext = createContext(null);

function useRelayChainApi(endpointUrls) {
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
  const relayChain = useRelayChain();
  const endpointUrls = useMemo(() => {
    const relayChainSettings = getChainSettings(relayChain);
    return relayChainSettings?.endpoints?.map?.((item) => item.url);
  }, [relayChain]);

  const relayChainApi = useRelayChainApi(endpointUrls);
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
