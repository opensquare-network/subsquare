import { filter, find, sortBy, uniqBy } from "lodash-es";
import {
  allWallets,
  coinbaseWallet,
  metamask,
  nova,
  okxWallet,
  phantom,
  subWallet,
  talisman,
} from "next-common/utils/consts/connect";
import { useConnectors } from "wagmi";
import { useDetectEthereum } from "./useDetectEthereum";
import { useHasCoinbaseWallet } from "./useHasCoinbaseWallet";

// always list wallets
const fixedWallets = [
  coinbaseWallet,
  metamask,
  talisman,
  okxWallet,
  subWallet,
  phantom,
  nova,
];

export function useEVMWallets() {
  const connectors = useConnectors();
  const ethereum = useDetectEthereum();

  /**
   * nova
   */
  const injectedConnector = find(connectors, { id: "injected" });
  // treat injectedConnector as nova connector
  const novaConnector =
    ethereum?.isNovaWallet && injectedConnector
      ? {
          ...injectedConnector,
          id: nova.extensionName,
          name: nova.title,
        }
      : null;
  const novaWalletOption = {
    ...nova,
    connector: novaConnector,
  };

  /**
   * coinbase wallet
   */
  const hasCoinbaseWallet = useHasCoinbaseWallet();
  const coinbaseWalletSDKConnector = find(connectors, {
    id: "coinbaseWalletSDK",
  });
  const coinbaseWalletConnector = hasCoinbaseWallet
    ? coinbaseWalletSDKConnector
    : null;
  const coinbaseWalletOption = {
    ...coinbaseWallet,
    connector: coinbaseWalletConnector,
  };

  const filteredConnectors = filter(connectors, (c) => {
    // ignore injected connector
    if (c.id === "injected") {
      return false;
    }

    // use coinbase sdk connector instead of injected coinbase wallet
    // to fix not working in coinbase wallet app
    if (c.name === coinbaseWallet.title) {
      return false;
    }

    return true;
  });

  const supportedWallets = uniqBy(
    [
      coinbaseWalletOption,
      ...filteredConnectors.map((connector) => {
        const found = find(allWallets, (w) => {
          return (
            w.title.toLowerCase() === connector.name.toLowerCase() ||
            w.extensionName.toLowerCase() === connector.name.toLowerCase()
          );
        });
        const logo = found?.logo;

        return {
          title: connector.name,
          extensionName: connector.name.toLowerCase(),
          logo,
          connector,
        };
      }),
      novaWalletOption,
      ...fixedWallets,
    ],
    "connector.id",
  );

  const resolvedWallets = supportedWallets.map((w) => {
    return {
      ...w,
      extensionName: metamask.extensionName,
    };
  });

  return sortBy(resolvedWallets, "connector");
}
