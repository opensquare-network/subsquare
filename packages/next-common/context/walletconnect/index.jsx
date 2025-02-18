import UniversalProvider from "@walletconnect/universal-provider";
import { getSdkError } from "@walletconnect/utils";
// import dayjs from "dayjs";
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
import { useLocalStorage } from "react-use";
import { CACHE_KEY } from "next-common/utils/constants";

// FIXME: use company project id
// `projectId` is configured on `https://cloud.walletconnect.com/`
const projectId = "16c4de5fd6fec3e0f3b6bdf2a67f2160";

const relayUrl = "wss://relay.walletconnect.com";

export const defaultWalletConnect = {
  /** @type {UniversalProvider} */
  provider: null,
  /** @type {import('@walletconnect/types').SessionTypes.Struct} */
  session: null,
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
  const chain = useChain();

  return caip ? `${chain}:${caip}` : null;
}

export default function WalletConnectProvider({ children }) {
  const chain = useChain();
  const { description } = useChainSettings();
  const { disconnect: disconnectAccount } = useConnectedAccountContext();

  const caip = useWalletConnectCaip();
  const chainId = useWalletConnectChainId();

  const [provider, setProvider] = useState(defaultWalletConnect.provider);

  const [session, setSession] = useState(defaultWalletConnect.session);

  const [walletConnectSession, setWalletConnectSession] = useLocalStorage(
    CACHE_KEY.walletConnectSession,
    session,
  );
  useEffect(() => {
    if (walletConnectSession) {
      setSession(walletConnectSession);
    }
  }, [walletConnectSession]);

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

    init();
  }, [chain, description]);

  const connect = useCallback(async () => {
    if (!provider) {
      return;
    }

    return await provider.client
      .connect({
        requiredNamespaces: {
          polkadot: {
            chains: [chainId],
            methods: ["polkadot_signTransaction", "polkadot_signMessage"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      })
      .then((result) => {
        result.approval().then((session) => {
          setSession(session);
          setWalletConnectSession(session);
        });

        return result;
      });
  }, [chainId, provider, setWalletConnectSession]);

  const disconnect = useCallback(async () => {
    if (!provider || !session) {
      return;
    }

    try {
      await provider.client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    } catch (error) {
      console.error(error);
    }

    setSession(null);
    setWalletConnectSession(null);
  }, [provider, session, setWalletConnectSession]);

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

    return filteredAccounts;
  }, [provider, session, caip]);

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

  useEffect(() => {
    if (provider) {
      provider.on("disconnect", () => {
        setSession(null);
        setWalletConnectSession(null);
        disconnectAccount();
      });

      provider.client.on("session_expire", (event) => {
        event;
        // TODO: handle session expire
        // https://docs.reown.com/walletkit/best-practices#session-request-expiry
        // 7 days by default
      });
    }

    return () => {
      if (provider) {
        provider.client.removeAllListeners();
      }
    };
  }, [disconnectAccount, provider, setWalletConnectSession]);

  // TODO: check expiry, session2.expiry
  // If a session has been connected to, check if it has not expired. If it has, disconnect from
  // the session (user will need to manually connect to a new session in the UI)
  // if (expiry) {
  //   const nowUnix = dayjs().unix();
  //   if (nowUnix > expiry) {
  //     disconnectWcSession();
  //     expired = true;
  //   }
  // }

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
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
