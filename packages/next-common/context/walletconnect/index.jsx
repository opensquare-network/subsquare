import UniversalProvider from "@walletconnect/universal-provider";
import { getSdkError } from "@walletconnect/utils";
import useChainInfo from "next-common/hooks/connect/useChainInfo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useConnectedAccountContext } from "../connectedAccount";
import { useLocalStorage, useAsyncFn } from "react-use";
import { CACHE_KEY, CHAIN } from "next-common/utils/constants";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newWarningToast,
} from "next-common/store/reducers/toastSlice";
import getChainSettings from "next-common/utils/consts/settings";
import WalletTypes from "next-common/utils/consts/walletTypes";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const relayUrl = "wss://relay.walletconnect.com";

export const defaultWalletConnect = {
  /** @type {UniversalProvider} */
  provider: null,
  /** @type {import('@walletconnect/types').SessionTypes.Struct} */
  session: null,
  disconnectLoading: false,
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  fetchAddresses: () => Promise.resolve([]),
  signWcMessage: () => Promise.resolve({ signature: "0x" }),
  signWcTx: () => Promise.resolve({ signature: "0x" }),
};

const WalletConnectContext = createContext(defaultWalletConnect);

export function useWalletConnect() {
  return useContext(WalletConnectContext);
}

function useWalletConnectCaip() {
  const chainInfo = useChainInfo();

  return chainInfo
    ? chainInfo?.genesisHash.substring(2).substring(0, 32)
    : null;
}

function useWalletConnectChainId() {
  const caip = useWalletConnectCaip();
  return caip ? `polkadot:${caip}` : null;
}

function isSubstrateSession(session) {
  const accounts = Object.values(session?.namespaces || {}).flatMap(
    (namespace) => namespace.accounts || [],
  );
  return (
    accounts.length > 0 &&
    accounts.every((account) => account.startsWith("polkadot:"))
  );
}

let providerPromise;

async function initWalletConnectProvider() {
  const { description, wallets, domain } = getChainSettings(CHAIN);
  if (wallets?.walletconnect === false) {
    return defaultWalletConnect.provider;
  }
  const url =
    window.location.origin || `https://${domain || CHAIN}.subsquare.io`;
  providerPromise ??= UniversalProvider.init({
    projectId,
    relayUrl,
    metadata: {
      name: "Subsquare",
      description,
      url,
      icons: [`${url}/favicon.ico`],
    },
  })
    .then(async (provider) => {
      // Discard EVM sessions created by the former cross-namespace connection.
      if (provider.session && !isSubstrateSession(provider.session)) {
        await provider.disconnect();
      }
      return provider;
    })
    .catch((error) => {
      providerPromise = null;
      throw error;
    });

  return await providerPromise;
}

export default function WalletConnectProvider({ children }) {
  const dispatch = useDispatch();
  const { disconnect: disconnectAccount, connectedAccount } =
    useConnectedAccountContext();

  const caip = useWalletConnectCaip();
  const chainId = useWalletConnectChainId();
  const [provider, setProvider] = useState(defaultWalletConnect.provider);
  const [session, setSession] = useState(defaultWalletConnect.session);
  const pendingConnection = useRef(null);
  const [cachedSession, setCachedSession] = useLocalStorage(
    CACHE_KEY.walletConnectSession,
    session,
  );
  const clearSession = useCallback(() => {
    setSession(null);
    setCachedSession(null);
  }, [setCachedSession, setSession]);

  const disconnectCombination = useCallback(async () => {
    clearSession();
    if (
      connectedAccount?.wallet === WalletTypes.WALLETCONNECT ||
      connectedAccount?.connectorId === "walletConnectUniversal"
    ) {
      await disconnectAccount();
    }
  }, [clearSession, connectedAccount, disconnectAccount]);

  useEffect(() => {
    if (!cachedSession) {
      return;
    }
    if (!isSubstrateSession(cachedSession)) {
      disconnectCombination();
      return;
    }
    setSession(cachedSession);
  }, [cachedSession, disconnectCombination]);

  useEffect(() => {
    if (provider) {
      return;
    }
    initWalletConnectProvider()
      .then(setProvider)
      .catch((error) => dispatch(newErrorToast(error.message)));
  }, [provider, dispatch]);

  const connect = useCallback(async () => {
    if (!provider || !chainId) {
      return;
    }

    if (pendingConnection.current) {
      return await pendingConnection.current;
    }

    pendingConnection.current = new Promise((resolve) => {
      const onDisplayUri = (uri) => resolve({ uri });
      provider.once("display_uri", onDisplayUri);
      provider
        .connect({
          namespaces: {
            polkadot: {
              chains: [chainId],
              methods: ["polkadot_signTransaction", "polkadot_signMessage"],
              events: ["chainChanged", "accountsChanged"],
            },
          },
        })
        .then(async (approvedSession) => {
          if (!isSubstrateSession(approvedSession)) {
            if (provider.session) {
              await provider.disconnect();
            }
            throw new Error("Please connect a Substrate account");
          }
          setSession(approvedSession);
          setCachedSession(approvedSession);
          resolve();
        })
        .catch((error) => {
          dispatch(newWarningToast(error.message));
          resolve();
        })
        .finally(() => {
          provider.removeListener("display_uri", onDisplayUri);
          pendingConnection.current = null;
        });
    });
    return await pendingConnection.current;
  }, [chainId, provider, setCachedSession, dispatch]);

  const [{ loading: disconnectLoading }, disconnect] = useAsyncFn(async () => {
    if (!provider || !session) {
      await disconnectCombination();
      return;
    }

    try {
      await provider.client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      await disconnectCombination();
    } catch (error) {
      console.error(error);
    }
  }, [provider, session, disconnectCombination]);

  const fetchAddresses = useCallback(async () => {
    if (!provider || !session || !caip) {
      return [];
    }

    const walletConnectAccounts = Object.values(session.namespaces || {})
      .map((namespace) => namespace.accounts)
      .flat();

    const filteredAccounts = walletConnectAccounts
      .filter((wcAccount) => {
        const [namespace, prefix] = wcAccount.split(":");
        return namespace === "polkadot" && prefix === caip;
      })
      .map((wcAccount) => {
        const address = wcAccount.split(":")[2];
        return address;
      });

    if (!filteredAccounts.length) {
      disconnectCombination();
    }

    return filteredAccounts;
  }, [provider, session, caip, disconnectCombination]);

  // Attempt to sign a message and receive a signature
  const signWcMessage = useCallback(
    async (params) => {
      if (!provider || !session) {
        return { signature: "0x" };
      }

      return await provider.client.request({
        chainId,
        topic: session.topic,
        request: {
          method: "polkadot_signMessage",
          params,
        },
      });
    },
    [chainId, provider, session],
  );

  // Attempt to sign a transaction and receive a signature
  const signWcTx = useCallback(
    async (payload) => {
      if (!provider || !session) {
        return { signature: "0x" };
      }

      return await provider.client.request({
        chainId,
        topic: session.topic,
        request: {
          method: "polkadot_signTransaction",
          params: {
            address: payload.address,
            transactionPayload: payload,
          },
        },
      });
    },
    [chainId, provider, session],
  );

  const onSessionExpire = useCallback(
    ({ topic }) => {
      if (topic !== session?.topic) {
        return;
      }
      dispatch(
        newErrorToast("Session expired, please connect to WalletConnect again"),
      );
      disconnectCombination();
    },
    [session?.topic, disconnectCombination, dispatch],
  );

  const onSessionDelete = useCallback(
    ({ topic }) => {
      if (topic !== session?.topic) {
        return;
      }
      dispatch(newErrorToast("The connection has been disconnected"));
      disconnectCombination();
    },
    [session?.topic, disconnectCombination, dispatch],
  );

  useEffect(() => {
    if (provider) {
      provider.on("disconnect", disconnectCombination);

      // if session expired, clear session and disconnect account
      // https://docs.reown.com/walletkit/best-practices#session-request-expiry
      provider.client.on("session_expire", onSessionExpire);
      provider.client.on("session_delete", onSessionDelete);
    }

    return () => {
      if (provider) {
        provider.off("disconnect", disconnectCombination);
        provider.client.off("session_expire", onSessionExpire);
        provider.client.off("session_delete", onSessionDelete);
      }
    };
  }, [disconnectCombination, onSessionExpire, onSessionDelete, provider]);

  // If web closed, mobile wallet do disconnect, next time open web, clear session and disconnect account
  useEffect(() => {
    if (provider && cachedSession) {
      try {
        const active = provider.client.session?.get(cachedSession.topic);
        if (!active) {
          disconnectCombination();
        }
      } catch (error) {
        disconnectCombination();
        console.error(error);
      }
    }
  }, [provider, cachedSession, disconnectCombination]);

  return (
    <WalletConnectContext.Provider
      value={{
        provider,
        session,
        connect,
        disconnect,
        fetchAddresses,
        signWcMessage,
        signWcTx,
        disconnectLoading,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
