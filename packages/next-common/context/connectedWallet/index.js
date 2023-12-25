import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import { createContext, useCallback, useContext, useState } from "react";

const ConnectedWalletContext = createContext(null);

export default ConnectedWalletContext;

export function ConnectedWalletProvider({
  connectedWallet: _connectedWallet,
  children,
}) {
  const [connectedWallet, setConnectedWallet] = useState(_connectedWallet);

  const connect = useCallback((wallet) => {
    setConnectedWallet(wallet);
    setCookie(CACHE_KEY.connectedWallet, JSON.stringify(wallet), 365);
  }, []);

  const disconnect = useCallback(() => {
    setConnectedWallet(null);
    clearCookie(CACHE_KEY.connectedWallet);
  }, []);

  return (
    <ConnectedWalletContext.Provider
      value={{
        connectedWallet,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectedWalletContext.Provider>
  );
}

export function useConnectedWalletContext() {
  const context = useContext(ConnectedWalletContext);
  if (!context) {
    throw new Error(
      "useConnectedWalletContext must be used within a ConnectedWalletProvider",
    );
  }
  return context;
}

export function useConnectedWallet() {
  const { connectedWallet } = useConnectedWalletContext();
  return connectedWallet;
}
