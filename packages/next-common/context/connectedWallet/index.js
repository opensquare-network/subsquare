import { CACHE_KEY } from "next-common/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

const ConnectedWalletContext = createContext(null);

export default ConnectedWalletContext;

export function ConnectedWalletProvider({ children }) {
  const [connectedWallet, setConnectedWallet] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setConnectedWallet(localStorage[CACHE_KEY.lastLoginAddress]);
    }
  }, []);

  return (
    <ConnectedWalletContext.Provider
      value={{ connectedWallet, setConnectedWallet }}
    >
      {children}
    </ConnectedWalletContext.Provider>
  );
}

export function useConnectedWallet() {
  const { connectedWallet } = useContext(ConnectedWalletContext);
  return connectedWallet;
}

export function useSetConnectedWallet() {
  const { setConnectedWallet } = useContext(ConnectedWalletContext);
  return setConnectedWallet;
}
