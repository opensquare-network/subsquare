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
import { useNovaWalletEvmInstalled } from "./useNovaWalletInstalled";

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
  const { chainType } = useChainSettings();
  const injectedConnector = find(connectors, { id: "injected" });
  const novaWalletInstalled = useNovaWalletEvmInstalled();

  // treat injectedConnector as nova connector
  const novaConnector =
    novaWalletInstalled && injectedConnector
      ? {
          ...injectedConnector,
          id: nova.extensionName,
          name: nova.title,
        }
      : null;

  const showTalisman = chainType === ChainTypes.ETHEREUM;
  const supportedConnectors = filter(connectors, (c) => {
    // ignore injected connector
    if (c.id === "injected") {
      return false;
    }

    // use coinbase sdk connector instead of injected coinbase wallet
    if (
      c.type === "injected" &&
      c.name.toLowerCase() === WalletTypes.COINBASE_WALLET
    ) {
      return false;
    }

    return true;
  });

  const walletConnectors = uniqBy(
    [
      ...supportedConnectors.map((connector) => {
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
      {
        ...nova,
        connector: novaConnector,
      },
      ...fixedWallets,
    ],
    "extensionName",
  );

  const options = filter(walletConnectors, (wallet) => {
    if (wallet.extensionName === WalletTypes.TALISMAN) {
      return showTalisman;
    }

    return true;
  });

  return options;
}
