import { CACHE_KEY } from "next-common/utils/constants";
import { clearCookie, setCookie } from "next-common/utils/viewfuncs/cookies";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useConnectors, useDisconnect } from "wagmi";
import { fetchAndUpdateUser, logoutUser, useUserContext } from "../user";
import { useLocalStorage } from "react-use";
import { clearMyMultisigsData } from "next-common/store/reducers/multisigSlice";
import { useDispatch } from "react-redux";
import { usePageLoading } from "next-common/context/pageLoading";
import { getMockAccountAddress } from "next-common/utils/mockAccount";

const ConnectedAccountContext = createContext(null);

let ssrConnectedAccount = null;
let savedConnectedAccount = null;

export default ConnectedAccountContext;

export function ConnectedAccountProvider({
  connectedAccount: _connectedAccount,
  children,
}) {
  ssrConnectedAccount = _connectedAccount;
  const userContext = useUserContext();
  const [connectedAccount, setConnectedAccount] = useState(_connectedAccount);
  const [lastConnectedAccount, setLastConnectedAccount] = useLocalStorage(
    CACHE_KEY.lastConnectedAccount,
  );
  const dispatch = useDispatch();
  const { setPageLoading } = usePageLoading();
  const connectors = useConnectors();
  const { mutateAsync } = useDisconnect();
  const isDisconnecting = useRef(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const walletConnect = connectors.find(
    (connector) =>
      connector.id === "walletConnect" &&
      connector.id === connectedAccount?.connectorId,
  );

  const saveConnectedAccount = useCallback((account) => {
    savedConnectedAccount = account;
    setCookie(CACHE_KEY.connectedAccount, JSON.stringify(account), 365);
    setConnectedAccount(account);
  }, []);

  const saveLastConnectedAccount = useCallback(
    (account) => {
      setLastConnectedAccount(account);
    },
    [setLastConnectedAccount],
  );

  const clearAccount = useCallback(async () => {
    await logoutUser(userContext);
    ssrConnectedAccount = null;
    savedConnectedAccount = null;
    clearCookie(CACHE_KEY.connectedAccount);
    setConnectedAccount(null);
    dispatch(clearMyMultisigsData());
  }, [userContext, dispatch]);

  useEffect(() => {
    function handleDisconnect() {
      if (!isDisconnecting.current) {
        clearAccount().catch(console.error);
      }
    }
    walletConnect?.emitter.on("disconnect", handleDisconnect);
    return () => walletConnect?.emitter.off("disconnect", handleDisconnect);
  }, [walletConnect, clearAccount]);

  const disconnect = useCallback(async () => {
    isDisconnecting.current = true;
    setDisconnectLoading(!!walletConnect);
    try {
      try {
        if (walletConnect) {
          await mutateAsync({ connector: walletConnect });
        }
      } finally {
        await clearAccount();
      }
    } finally {
      isDisconnecting.current = false;
      setDisconnectLoading(false);
    }
  }, [walletConnect, mutateAsync, clearAccount]);

  const connect = useCallback(
    async (account) => {
      try {
        setPageLoading(true);
        // Selecting an account must keep its wallet session available.
        await clearAccount();
        const mockAddress = getMockAccountAddress();
        const effectiveAccount = mockAddress
          ? { ...account, address: mockAddress }
          : account;
        saveConnectedAccount(effectiveAccount);
        saveLastConnectedAccount(effectiveAccount);
        await fetchAndUpdateUser(userContext);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoading(false);
      }
    },
    [
      clearAccount,
      saveLastConnectedAccount,
      saveConnectedAccount,
      userContext,
      setPageLoading,
    ],
  );

  return (
    <ConnectedAccountContext.Provider
      value={{
        connectedAccount,
        lastConnectedAccount,
        connect,
        disconnect,
        disconnectLoading,
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

export function getContextConnectedAccount() {
  return savedConnectedAccount || ssrConnectedAccount;
}
