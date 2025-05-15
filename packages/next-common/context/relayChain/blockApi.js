import { useRelayChain } from "next-common/hooks/useRelayChain";
import getChainSettings from "next-common/utils/consts/settings";
import { createContext, useContext, useEffect, useState } from "react";
import { getChainApiAt } from "next-common/utils/getChainApi";

const RelayChainBlockApiContext = createContext(null);

export function RelayChainBlockApiProvider({ children, blockHeightOrHash }) {
  const [api, setApi] = useState(null);
  const relayChain = useRelayChain();
  const relayChainSettings = getChainSettings(relayChain);

  useEffect(() => {
    getChainApiAt(
      relayChainSettings?.endpoints?.map?.((item) => item.url),
      blockHeightOrHash,
    ).then(setApi);
  }, [relayChainSettings.endpoints]);

  return (
    <RelayChainBlockApiContext.Provider value={api}>
      {children}
    </RelayChainBlockApiContext.Provider>
  );
}

export function useRelayChainBlockApi() {
  return useContext(RelayChainBlockApiContext);
}
