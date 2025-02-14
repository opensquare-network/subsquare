// https://github.com/polkadot-cloud/polkadot-staking-dashboard/blob/main/packages/app/src/contexts/WalletConnect/index.tsx

import { WalletConnectModal } from "@walletconnect/modal";
import UniversalProvider from "@walletconnect/universal-provider";
import { getSdkError } from "@walletconnect/utils";
import dayjs from "dayjs";
import useChainInfo from "next-common/hooks/connect/useChainInfo";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useChain, useChainSettings } from "../chain";
import { useConnectedAccountContext } from "../connectedAccount";

// FIXME: use company project id
// `projectId` is configured on `https://cloud.walletconnect.com/`
const projectId = "16c4de5fd6fec3e0f3b6bdf2a67f2160";

const relayUrl = "wss://relay.walletconnect.com";

export const defaultWalletConnect = {
  connectProvider: () => Promise.resolve(),
  wcInitialized: false,
  initializeWcSession: () => Promise.resolve(),
  updateWcSession: () => Promise.resolve(),
  disconnectWcSession: () => Promise.resolve(),
  wcSessionActive: false,
  fetchAddresses: () => Promise.resolve([]),
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

  // The WalletConnect provider
  const wcProvider = useRef(null);

  // The WalletConnect modal handler
  const wcModal = useRef(null);

  // Track whether pairing has been initiated
  const pairingInitiated = useRef(false);

  // Connect metadata for the WalletConnect provider
  const [wcMeta, setWcMeta] = useState(null);

  // Store whether the provider has been wcInitialized
  const [wcInitialized, setWcInitialized] = useState(false);

  // Store whether the wallet connect session is active
  const [wcSessionActive, setWcSessionActive] = useState(false);

  // Store the set of chain id the most recent session is connected to
  const sessionChain = useRef();

  const caip = useWalletConnectCaip();

  const chainId = useWalletConnectChainId();

  // Init WalletConnect provider & modal, and update as wcInitialized
  async function initProvider() {
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

    const modal = new WalletConnectModal({
      projectId,
    });

    wcProvider.current = provider;

    // Subscribe to session delete
    wcProvider.current.on("session_delete", () => {
      disconnectWcSession();
      disconnectAccount();
    });

    wcModal.current = modal;
    setWcInitialized(true);
  }

  // Connect WalletConnect provider and retrieve metadata
  async function connectProvider() {
    if (!wcInitialized) {
      return;
    }

    // Disconnect from current session if it exists
    if (pairingInitiated.current) {
      await disconnectWcSession();
    }

    // Update most recent connected chain
    sessionChain.current = chain;

    // If there are no chains connected, return early
    if (!caip) {
      return;
    }

    // If an existing session exists, get the topic and add to `connect` to restore it. NOTE:
    // Initialisation has already happened, so we know the provider exists
    const pairingTopic = wcProvider.current.session?.pairingTopic;

    const namespaces = {
      polkadot: {
        chains: [chainId],
        methods: ["polkadot_signTransaction", "polkadot_signMessage"],
        events: ["chainChanged", "accountsChanged"],
      },
    };

    const connectConfig = {
      requiredNamespaces: namespaces,
    };

    // If no pairing topic or session exists, go ahead and create one, and store meta data for
    // `wcModal` to use
    let expiry;
    let expired = false;
    if (!pairingTopic) {
      const { uri, approval } = await wcProvider.current.client.connect(
        connectConfig,
      );
      setWcMeta({ uri, approval });

      // Check session expiry and disconnect from session if expired.
      expiry = wcProvider.current.session?.expiry;
    }

    // If a session has been connected to, check if it has not expired. If it has, disconnect from
    // the session (user will need to manually connect to a new session in the UI)
    if (expiry) {
      const nowUnix = dayjs(new Date()).unix();
      if (nowUnix > expiry) {
        disconnectWcSession();
        expired = true;
      }
    }

    // If the session has not expired, flag as an initiated session
    if (!expired) {
      pairingInitiated.current = true;
      if (pairingTopic) {
        setWcSessionActive(true);
      }
    }
  }

  // Update session namespaces. NOTE: This method is currently not in use due to a
  // default chain error upon reconnecting to the session
  async function updateWcSession() {
    if (!wcInitialized) {
      return;
    }
    // Update most recent connected chains
    sessionChain.current = chain;

    // If there are no chains connected, return early
    if (!caip) {
      return;
    }
    const topic = wcProvider.current.session?.topic;
    if (topic) {
      await wcProvider.current.client.update({
        topic,
        namespaces: {
          polkadot: {
            chains: [chainId],
            accounts: [],
            methods: ["polkadot_signTransaction", "polkadot_signMessage"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });
    }
  }

  // Initiate a new Wallet Connect session, if not already wcInitialized
  async function initializeWcSession() {
    if (wcInitialized) {
      let wcSession;
      if (wcProvider.current?.session) {
        wcSession = wcProvider.current.session;
      } else {
        wcSession = await initializeNewSession();
      }

      setWcSessionActive(true);
      return wcSession;
    }
    return null;
  }

  // Handle `approval()` by summoning a new modal and initiating a new Wallet Connect session
  async function initializeNewSession() {
    if (!wcInitialized) {
      return;
    }

    // Summon Wallet Connect modal that presents QR Code
    if (wcMeta?.uri) {
      wcModal.current.openModal({ uri: wcMeta.uri });
    }

    // Get session from approval
    const newWcSession = await wcMeta?.approval();

    // Close modal on approval completion
    wcModal.current.closeModal();

    // Update session data in provider
    if (wcProvider.current) {
      wcProvider.current.session = newWcSession;
    }

    return newWcSession;
  }

  // Disconnect from current session
  async function disconnectWcSession() {
    if (!wcProvider.current) {
      return;
    }

    const topic = wcProvider.current.session?.topic;
    if (topic) {
      await wcProvider.current.client.disconnect({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
      delete wcProvider.current.session;
    }

    // Reset session state data
    pairingInitiated.current = false;
    sessionChain.current = chain;
    setWcSessionActive(false);
  }

  // Attempt to sign a message and receive a signature
  async function signWcMessage(params) {
    if (!wcProvider.current || !wcProvider.current.session?.topic) {
      return { signature: "0x" };
    }
    const topic = wcProvider.current.session.topic;

    return await wcProvider.current.client.request({
      chainId,
      topic,
      request: {
        method: "polkadot_signMessage",
        params,
      },
    });
  }

  // Attempt to sign a transaction and receive a signature
  async function signWcTx(payload) {
    if (!wcProvider.current || !wcProvider.current.session?.topic) {
      return { signature: "0x" };
    }
    const topic = wcProvider.current.session.topic;

    return await wcProvider.current.client.request({
      chainId,
      topic,
      request: {
        method: "polkadot_signTransaction",
        params: {
          address: payload.address,
          transactionPayload: payload,
        },
      },
    });
  }

  async function fetchAddresses() {
    // Retrieve a new session or get current one
    const wcSession = await initializeWcSession();
    if (wcSession === null) {
      return [];
    }

    // Get accounts from session
    const walletConnectAccounts = Object.values(wcSession.namespaces)
      .map((namespace) => namespace.accounts)
      .flat();

    // Only get accounts for the currently selected `caip`
    let filteredAccounts = walletConnectAccounts.filter((wcAccount) => {
      const prefix = wcAccount.split(":")[1];
      return prefix === caip;
    });

    // grab account addresses from CAIP account formatted accounts
    filteredAccounts = filteredAccounts.map((wcAccount) => {
      const address = wcAccount.split(":")[2];
      return address;
    });

    return filteredAccounts;
  }

  // On initial render, initiate the WalletConnect provider
  useEffect(() => {
    if (!wcProvider.current) {
      initProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initially, all active chains (in all tabs) must be connected and ready for the initial provider
  // connection
  useEffect(() => {
    if (!pairingInitiated.current && wcInitialized) {
      connectProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wcInitialized]);

  // Reconnect provider to a new session if a new connected chain is added, or when the provider is
  // set. This can only happen once pairing has been initiated. Doing this will require approval
  // from the user again
  useEffect(() => {
    if (
      pairingInitiated.current &&
      wcInitialized &&
      sessionChain.current !== chain
    ) {
      connectProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return (
    <WalletConnectContext.Provider
      value={{
        connectProvider,
        initializeWcSession,
        updateWcSession,
        disconnectWcSession,
        wcInitialized,
        wcSessionActive,
        fetchAddresses,
        signWcMessage,
        signWcTx,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
}
