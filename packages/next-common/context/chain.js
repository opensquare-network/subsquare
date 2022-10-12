import { createContext, useContext } from "react";

const ChainContext = createContext(process.env.NEXT_PUBLIC_CHAIN);

export default function ChainProvider({ chain, children }) {
  return <ChainContext.Provider value={ chain }>
      { children }
  </ChainContext.Provider>
}

export function useChain() {
  return useContext(ChainContext);
}
