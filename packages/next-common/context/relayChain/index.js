import { useRelayChain } from "next-common/hooks/useRelayChain";
import getChainSettings from "next-common/utils/consts/settings";
import { getChainApi } from "next-common/utils/getChainApi";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RelayChainApiContext = createContext(null);

export function RelayChainApiProvider({ children }) {
  const [api, setApi] = useState(null);
  const relayChain = useRelayChain();

  const endpoints = useMemo(() => {
    const relayChainSettings = getChainSettings(relayChain);

    return (
      relayChainSettings?.relayChainEndpoints ||
      relayChainSettings?.endpoints ||
      []
    );
  }, [relayChain]);

  useEffect(() => {
    getChainApi(endpoints.map?.((item) => item.url)).then(setApi);
  }, [endpoints]);

  return (
    <RelayChainApiContext.Provider value={api}>
      {children}
    </RelayChainApiContext.Provider>
  );
}

export function useRelayChainApi() {
  return useContext(RelayChainApiContext);
}
