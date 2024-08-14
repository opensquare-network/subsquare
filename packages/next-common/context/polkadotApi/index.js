import { getPolkadotApi } from "next-common/utils/polkadot";
import { createContext, useContext, useEffect, useState } from "react";

const PolkadotApiContext = createContext(null);

export function PolkadotApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getPolkadotApi().then(setApi);
  }, []);

  return (
    <PolkadotApiContext.Provider value={api}>
      {children}
    </PolkadotApiContext.Provider>
  );
}

export function usePolkadotApi() {
  return useContext(PolkadotApiContext);
}
