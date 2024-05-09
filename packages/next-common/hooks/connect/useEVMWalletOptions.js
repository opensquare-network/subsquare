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
import { useNovaWalletInstalled } from "./useNovaWalletInstalled";

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
  const novaWalletInstalled = useNovaWalletInstalled();

  // treat injectedConnector as nova connector
  const novaConnector =
    novaWalletInstalled.evm && injectedConnector
      ? {
          ...injectedConnector,
          id: nova.extensionName,
          name: nova.title,
        }
      : null;

  const showTalisman = chainType === ChainTypes.ETHEREUM;
  const supportedConnectors = filter(connectors, (c) => {
    // ignore injected connector
    return c.id !== "injected";
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
