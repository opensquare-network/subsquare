import { createContext, useContext, useEffect, useState } from "react";
import { getChainApiAt } from "next-common/utils/getChainApi";
import { RelayChainApiProvider, useRelayChainApi } from ".";

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

export function RelayChainBlockApiProvider({ children, blockHeightOrHash }) {
  return (
    <RelayChainApiProvider>
      <RelayChainBlockApiProviderImpl blockHeightOrHash={blockHeightOrHash}>
        {children}
      </RelayChainBlockApiProviderImpl>
    </RelayChainApiProvider>
  );
}

function RelayChainBlockApiProviderImpl({ children, blockHeightOrHash }) {
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
