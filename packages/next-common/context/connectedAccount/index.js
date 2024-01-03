import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchAndUpdateUser,
  logoutUser,
  useIsLoggedIn,
  useUserContext,
} from "../user";
import getStorageAddressInfo from "next-common/utils/getStorageAddressInfo";

const ConnectedAccountContext = createContext(null);

export default ConnectedAccountContext;

export function ConnectedAccountProvider({
  connectedAccount: _connectedAccount,
  children,
}) {
  const isLoggedIn = useIsLoggedIn();
  const userContext = useUserContext();
  const [connectedAccount, setConnectedAccount] = useState(_connectedAccount);
  const [lastConnectedAccount, setLastConnectedAccount] = useState();

  useEffect(() => {
    const info = getStorageAddressInfo(CACHE_KEY.lastConnectedAccount);
    if (info) {
      setLastConnectedAccount(info);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectedAccount(null);
    clearCookie(CACHE_KEY.connectedAccount);
    if (isLoggedIn) {
      await logoutUser(userContext);
    } else {
      userContext.setUser(null);
      userContext.setUserStatus(null);
    }
  }, [isLoggedIn, userContext]);

  const connect = useCallback(
    async (account) => {
      await disconnect();
      setConnectedAccount(account);
      setCookie(CACHE_KEY.connectedAccount, JSON.stringify(account), 365);
      setLastConnectedAccount(account);
      localStorage.setItem(
        CACHE_KEY.lastConnectedAccount,
        JSON.stringify(account),
      );
      await fetchAndUpdateUser(userContext);
    },
    [disconnect, userContext],
  );

  return (
    <ConnectedAccountContext.Provider
      value={{
        connectedAccount,
        lastConnectedAccount,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectedAccountContext.Provider>
  );
}

export function useConnectedAccountContext() {
  const context = useContext(ConnectedAccountContext);
  if (!context) {
    throw new Error(
      "useConnectedAccountContext must be used within a ConnectedAccountProvider",
    );
  }
  return context;
}

export function useConnectedAccount() {
  const { connectedAccount } = useConnectedAccountContext();
  return connectedAccount;
}
