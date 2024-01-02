import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import { createContext, useCallback, useContext, useState } from "react";
import {
  fetchAndUpdateUser,
  logoutUser,
  useIsLoggedIn,
  useUser,
  useUserContext,
} from "../user";

const ConnectedAccountContext = createContext(null);

export default ConnectedAccountContext;

export function ConnectedAccountProvider({ children }) {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const userContext = useUserContext();
  const [connectedAccount, setConnectedAccount] = useState();

  const connect = useCallback(
    async (account) => {
      setConnectedAccount(account);
      setCookie(CACHE_KEY.connectedAccount, JSON.stringify(account), 365);
      await fetchAndUpdateUser(userContext);
    },
    [user, userContext],
  );

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

  return (
    <ConnectedAccountContext.Provider
      value={{
        connectedAccount,
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
