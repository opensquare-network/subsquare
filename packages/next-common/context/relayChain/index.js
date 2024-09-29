import { getRelayChainApi } from "next-common/utils/relayChain";
import { createContext, useContext, useEffect, useState } from "react";

const RelayChainApiContext = createContext(null);

export function RelayChainApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getRelayChainApi().then(setApi);
  }, []);

  return (
    <RelayChainApiContext.Provider value={api}>
      {children}
    </RelayChainApiContext.Provider>
  );
}

export function useRelayChainApi() {
  return useContext(RelayChainApiContext);
}
