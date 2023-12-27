import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import { createContext, useCallback, useContext, useState } from "react";
import {
  fetchAndUpdateUser,
  logoutUser,
  useUser,
  useUserDispatch,
} from "../user";

const ConnectedWalletContext = createContext(null);

export default ConnectedWalletContext;

export function ConnectedWalletProvider({
  connectedWallet: _connectedWallet,
  children,
}) {
  const user = useUser();
  const userDispatch = useUserDispatch();
  const [connectedWallet, setConnectedWallet] = useState(_connectedWallet);

  const connect = useCallback(
    async (wallet) => {
      setConnectedWallet(wallet);
      setCookie(CACHE_KEY.connectedWallet, JSON.stringify(wallet), 365);
      if (user?.isLogin) {
        await fetchAndUpdateUser(userDispatch);
      }
    },
    [user, userDispatch],
  );

  const disconnect = useCallback(async () => {
    setConnectedWallet(null);
    clearCookie(CACHE_KEY.connectedWallet);
    if (user?.isLogin) {
      await logoutUser(userDispatch);
    }
  }, [user, userDispatch]);

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
