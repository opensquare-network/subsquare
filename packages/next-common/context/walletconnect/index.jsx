import UniversalProvider from "@walletconnect/universal-provider";
import { getSdkError } from "@walletconnect/utils";
import useChainInfo from "next-common/hooks/connect/useChainInfo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useChain, useChainSettings } from "../chain";
import { useConnectedAccountContext } from "../connectedAccount";
import { useLocalStorage, useAsyncFn } from "react-use";
import { CACHE_KEY } from "next-common/utils/constants";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newWarningToast,
} from "next-common/store/reducers/toastSlice";

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

export default function WalletConnectProvider({ children }) {
  const dispatch = useDispatch();
  const chain = useChain();
  const { description, wallets } = useChainSettings();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();

  const caip = useWalletConnectCaip();
  const chainId = useWalletConnectChainId();
  const [provider, setProvider] = useState(defaultWalletConnect.provider);
  const [session, setSession] = useState(defaultWalletConnect.session);

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

  // Init WalletConnect provider
  useEffect(() => {
    async function init() {
      const provider = await UniversalProvider.init({
        projectId,
        relayUrl,
        metadata: {
          name: "Subsquare",
          description,
          url: `https://${chain}.subsquare.io`,
          icons: [`https://${chain}.subsquare.io/favicon.ico`],
        },
      });

      setProvider(provider);
    }

    if (wallets?.walletconnect !== false) {
      init();
    }
  }, [chain, description, wallets]);

  const connect = useCallback(async () => {
    if (!provider) {
      return;
    }

    return await provider.client
      .connect({
        optionalNamespaces: {
          polkadot: {
            chains: [chainId],
            methods: ["polkadot_signTransaction", "polkadot_signMessage"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      })
      .then((result) => {
        result
          .approval()
          .then((session) => {
            setSession(session);
            setCachedSession(session);
          })
          .catch((error) => {
            const isUserRefused = error.code === 5000;
            const isUnsupportedChains = error.code === 5100;
            if ((isUserRefused || isUnsupportedChains) && error.message) {
              dispatch(newWarningToast(error.message));
            }
            console.error(error);
          });

        return result;
      });
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
    if (!provider || !session) {
      return [];
    }

    const walletConnectAccounts = Object.values(session.namespaces)
      .map((namespace) => namespace.accounts)
      .flat();

    const filteredAccounts = walletConnectAccounts
      .filter((wcAccount) => {
        const prefix = wcAccount.split(":")[1];
        return prefix === caip;
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

  const onSessionExpire = useCallback(() => {
    dispatch(
      newErrorToast("Session expired, please connect to WalletConnect again"),
    );
    disconnectCombination();
  }, [disconnectCombination, dispatch]);

  const onSessionDelete = useCallback(() => {
    dispatch(newErrorToast("The connection has been disconnected"));
    disconnectCombination();
  }, [disconnectCombination, dispatch]);

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
        provider.client.removeAllListeners();
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
