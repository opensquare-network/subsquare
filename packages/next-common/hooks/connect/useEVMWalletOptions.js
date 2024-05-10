import { filter, find, uniqBy } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
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
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnectors } from "wagmi";
import { useDetectEthereum } from "./useDetectEthereum";

const fixedWallets = [
  coinbaseWallet,
  metamask,
  talisman,
  okxWallet,
  subWallet,
  phantom,
  nova,
];

export function useEVMWalletOptions() {
  const connectors = useConnectors();
  const ethereum = useDetectEthereum();
  const { chainType } = useChainSettings();
  const showTalisman = chainType === ChainTypes.ETHEREUM;

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
  const injectedCoinbaseWalletConnector = find(connectors, {
    type: "injected",
    id: "com.coinbase.wallet",
  });
  const coinbaseWalletSDKConnector = find(connectors, {
    id: "coinbaseWalletSDK",
  });
  const hasCoinbaseWallet =
    // coinbase wallet extension
    !!injectedCoinbaseWalletConnector ||
    // coinbase app browser
    ethereum?.isCoinbaseWallet;
  const coinbaseWalletConnector = hasCoinbaseWallet
    ? coinbaseWalletSDKConnector
    : null;
  // eslint-disable-next-line no-unused-vars
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
      // return false;
    }

    return true;
  });

  const supportedWalletOptions = uniqBy(
    [
      // coinbaseWalletOption,
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

  const options = filter(supportedWalletOptions, (wallet) => {
    if (wallet.extensionName === WalletTypes.TALISMAN) {
      return showTalisman;
    }

    return true;
  });

  return options;
}
