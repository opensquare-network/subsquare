import { createContext, useContext } from "react";

const RelayChainContext = createContext();

export function RelayChainProvider({ children }) {
  return (
    <RelayChainContext.Provider value={process.env.NEXT_PUBLIC_RELAY_CHAIN}>
      {children}
    </RelayChainContext.Provider>
  );
}

export function useRelayChain() {
  return useContext(RelayChainContext);
}
