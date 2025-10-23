import { createContext, useContext } from "react";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

const RelayInfoContext = createContext({});

export default function RelayInfoProvider({ children }) {
  const height = useAhmLatestHeight();

  return (
    <RelayInfoContext.Provider
      value={{
        height,
      }}
    >
      {children}
    </RelayInfoContext.Provider>
  );
}

export function useRelayHeight() {
  const { height } = useContext(RelayInfoContext);
  return height;
}
