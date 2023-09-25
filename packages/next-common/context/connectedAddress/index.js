import { CACHE_KEY } from "next-common/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

const ConnectedAddressContext = createContext(null);

export default ConnectedAddressContext;

export function ConnectedAddressProvider({ children }) {
  const [connectedAddress, setConnectedAddress] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setConnectedAddress(localStorage[CACHE_KEY.lastLoginAddress]);
    }
  }, []);

  return (
    <ConnectedAddressContext.Provider
      value={{ connectedAddress, setConnectedAddress }}
    >
      {children}
    </ConnectedAddressContext.Provider>
  );
}

export function useConnectedAddress() {
  const { connectedAddress } = useContext(ConnectedAddressContext);
  return connectedAddress;
}

export function useSetConnectedAddress() {
  const { setConnectedAddress } = useContext(ConnectedAddressContext);
  return setConnectedAddress;
}
