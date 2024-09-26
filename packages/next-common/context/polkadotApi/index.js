import { getRelayChainApi } from "next-common/utils/polkadot";
import { createContext, useContext, useEffect, useState } from "react";

const RelayChainContext = createContext(null);

export function RelayChainApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getRelayChainApi().then(setApi);
  }, []);

  return (
    <RelayChainContext.Provider value={api}>
      {children}
    </RelayChainContext.Provider>
  );
}

export function useRelayChainApi() {
  return useContext(RelayChainContext);
}
