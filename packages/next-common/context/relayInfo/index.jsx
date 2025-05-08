import useChainOrScanHeight from "next-common/hooks/height";
import { createContext, useContext } from "react";

const RelayInfoContext = createContext({});

export default function RelayInfoProvider({ children }) {
  const height = useChainOrScanHeight();

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
