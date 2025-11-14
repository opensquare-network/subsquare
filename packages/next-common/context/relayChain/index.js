import { useRelayChainEndpoints } from "next-common/hooks/useRelayChain";
import { getChainApi } from "next-common/utils/getChainApi";
import { createContext, useContext, useEffect, useState } from "react";

const RelayChainApiContext = createContext(null);

export function RelayChainApiProvider({ children }) {
  const [api, setApi] = useState(null);
  const endpoints = useRelayChainEndpoints();

  useEffect(() => {
    getChainApi(endpoints).then(setApi);
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
