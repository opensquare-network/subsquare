import { useRelayChain } from "next-common/hooks/useRelayChain";
import getChainSettings from "next-common/utils/consts/settings";
import { getChainApi } from "next-common/utils/getChainApi";
import { createContext, useContext, useEffect, useState } from "react";

const RelayChainApiContext = createContext(null);

export function RelayChainApiProvider({ children }) {
  const [api, setApi] = useState(null);
  const relayChain = useRelayChain();
  const relayChainSettings = getChainSettings(relayChain);

  useEffect(() => {
    getChainApi(relayChainSettings?.endpoints?.map?.((item) => item.url)).then(
      setApi,
    );
  }, [relayChainSettings.endpoints]);

  return (
    <RelayChainApiContext.Provider value={api}>
      {children}
    </RelayChainApiContext.Provider>
  );
}

export function useRelayChainApi() {
  return useContext(RelayChainApiContext);
}
