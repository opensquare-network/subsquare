import UniversalProvider from "@walletconnect/universal-provider";
import { getSdkError } from "@walletconnect/utils";
import useChainInfo from "next-common/hooks/connect/useChainInfo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { connect as connectWagmi, getAccount } from "@wagmi/core";
import { injected } from "wagmi/connectors";
import { wagmiConfig } from "next-common/context/wagmi";

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
  isEvmSession: false,
  connectEvm: () => Promise.resolve(),
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
  });

  try {
    return await providerPromise;
  } catch (error) {
    providerPromise = null;
    throw error;
  }
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
  const pendingEvmConnection = useRef(null);
  const sessionAccounts = Object.values(session?.namespaces || {}).flatMap(
    (namespace) => namespace.accounts || [],
  );
  const isEvmSession =
    !sessionAccounts.some((account) => account.startsWith("polkadot:")) &&
    sessionAccounts.some((account) => account.startsWith("eip155:"));
  const evmConnector = useMemo(
    () =>
      injected({
        shimDisconnect: false,
        target: {
          id: "walletConnectUniversal",
          name: "WalletConnect",
          provider: () => provider,
        },
      }),
    [provider],
  );
  const connectEvm = useCallback(async () => {
    if (
      !provider ||
      !isEvmSession ||
      provider.session?.topic !== session?.topic
    ) {
      throw new Error("No EVM WalletConnect session");
    }
    const current = getAccount(wagmiConfig);
    if (
      current.isConnected &&
      current.connector?.id === "walletConnectUniversal"
    ) {
      return;
    }
    pendingEvmConnection.current ??= connectWagmi(wagmiConfig, {
      connector: evmConnector,
    }).finally(() => {
      pendingEvmConnection.current = null;
    });
    return await pendingEvmConnection.current;
  }, [provider, isEvmSession, evmConnector, session?.topic]);

  useEffect(() => {
    if (
      isEvmSession &&
      provider &&
      provider.session?.topic === session?.topic &&
      connectedAccount?.connectorId === "walletConnectUniversal"
    ) {
      connectEvm().catch((error) => dispatch(newErrorToast(error.message)));
    }
  }, [
    provider,
    session?.topic,
    isEvmSession,
    connectedAccount?.connectorId,
    connectEvm,
    dispatch,
  ]);

  const [cachedSession, setCachedSession] = useLocalStorage(
    CACHE_KEY.walletConnectSession,
    session,
  );
  useEffect(() => {
    if (cachedSession) {
      setSession(cachedSession);
    }
  }, [cachedSession]);

  const clearSession = useCallback(() => {
    setSession(null);
    setCachedSession(null);
  }, [setCachedSession, setSession]);

  const disconnectCombination = useCallback(async () => {
    clearSession();
    await disconnectAccount();
  }, [clearSession, disconnectAccount]);

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

    const chains = wagmiConfig.chains;
    pendingConnection.current = new Promise((resolve) => {
      const onDisplayUri = (uri) => resolve({ uri });
      provider.once("display_uri", onDisplayUri);
      provider
        .connect({
          optionalNamespaces: {
            polkadot: {
              chains: [chainId],
              methods: ["polkadot_signTransaction", "polkadot_signMessage"],
              events: ["chainChanged", "accountsChanged"],
            },
            eip155: {
              chains: chains.map((chain) => `eip155:${chain.id}`),
              methods: [
                "personal_sign",
                "eth_sendTransaction",
                "eth_signTypedData_v4",
                "wallet_addEthereumChain",
                "wallet_switchEthereumChain",
              ],
              events: ["chainChanged", "accountsChanged"],
              rpcMap: Object.fromEntries(
                chains.map((chain) => [
                  chain.id,
                  chain.rpcUrls.default.http[0],
                ]),
              ),
            },
          },
        })
        .then((approvedSession) => {
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
    if (!provider || !session || !caip || isEvmSession) {
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
  }, [provider, session, caip, isEvmSession, disconnectCombination]);

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
      if (topic !== session?.topic) return;
      dispatch(
        newErrorToast("Session expired, please connect to WalletConnect again"),
      );
      disconnectCombination();
    },
    [session?.topic, disconnectCombination, dispatch],
  );

  const onSessionDelete = useCallback(
    ({ topic }) => {
      if (topic !== session?.topic) return;
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
        isEvmSession,
        connectEvm,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
