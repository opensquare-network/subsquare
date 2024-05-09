import { filter, find, uniqBy } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import {
  allWallets,
  coinbaseWallet,
  metamask,
  nova,
  nova as novaWallet,
  okxWallet,
  phantom,
  subWallet,
  talisman,
} from "next-common/utils/consts/connect";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnectors } from "wagmi";

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

  // treat injectedConnector as nova connector
  const novaConnector = injectedConnector
    ? {
        ...injectedConnector,
        id: novaWallet.extensionName,
        name: novaWallet.title,
      }
    : null;

  const showTalisman = chainType === ChainTypes.ETHEREUM;
  const supportedConnectors = filter(connectors, (c) => {
    // ignore injected connector
    if (c.id === "injected") {
      return false;
    }

    if (c.name.toLowerCase() === WalletTypes.TALISMAN) {
      return showTalisman;
    }
    return true;
  });

  const options = uniqBy(
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
        ...novaWallet,
        connector: novaConnector,
      },
      ...fixedWallets,
    ],
    "extensionName",
  );

  return options;
}
