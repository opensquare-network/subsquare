import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import { createContext, useCallback, useContext, useState } from "react";
import { fetchAndUpdateUser, logoutUser, useUserContext } from "../user";
import { useLocalStorage } from "react-use";
import { clearMyMultisigsData } from "next-common/store/reducers/multisigSlice";
import { useDispatch } from "react-redux";

const ConnectedAccountContext = createContext(null);

export default ConnectedAccountContext;

export function ConnectedAccountProvider({
  connectedAccount: _connectedAccount,
  children,
}) {
  const userContext = useUserContext();
  const [connectedAccount, setConnectedAccount] = useState(_connectedAccount);
  const [lastConnectedAccount, setLastConnectedAccount] = useLocalStorage(
    CACHE_KEY.lastConnectedAccount,
  );
  const dispatch = useDispatch();

  const saveConnectedAccount = useCallback((account) => {
    setConnectedAccount(account);
    setCookie(CACHE_KEY.connectedAccount, JSON.stringify(account), 365);
  }, []);

  const saveLastConnectedAccount = useCallback(
    (account) => {
      setLastConnectedAccount(account);
    },
    [setLastConnectedAccount],
  );

  const disconnect = useCallback(async () => {
    await logoutUser(userContext);
    setConnectedAccount(null);
    clearCookie(CACHE_KEY.connectedAccount);
    dispatch(clearMyMultisigsData());
  }, [userContext, dispatch]);

  const connect = useCallback(
    async (account) => {
      await disconnect();
      saveConnectedAccount(account);
      saveLastConnectedAccount(account);
      await fetchAndUpdateUser(userContext);
    },
    [disconnect, saveLastConnectedAccount, saveConnectedAccount, userContext],
  );

  return (
    <ConnectedAccountContext.Provider
      value={{
        connectedAccount,
        lastConnectedAccount,
        connect,
        disconnect,
        saveConnectedAccount,
        saveLastConnectedAccount,
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
