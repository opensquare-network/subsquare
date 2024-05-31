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
import { useIsCoinbaseWallet } from "./useIsCoinbaseWallet";
import WalletTypes from "next-common/utils/consts/walletTypes";

// always list wallets
const fixedWallets = [
  coinbaseWallet,
  metamask,
  talisman,
  okxWallet,
  // in EVM, Subwallet extension name
  // is "SubWallet", not "subwallet-js"
  {
    ...subWallet,
    extensionName: WalletTypes.SUBWALLET_JS.replace("-js", ""),
  },
  phantom,
  nova,
];

export const useEVMWallets = useWallets;

export function useWallets() {
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
  const isCoinbaseWallet = useIsCoinbaseWallet();
  const coinbaseWalletSDKConnector = find(connectors, {
    id: "coinbaseWalletSDK",
  });
  const coinbaseWalletConnector = isCoinbaseWallet
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
    "extensionName",
  );

  return sortBy(supportedWallets, "connector");
}
