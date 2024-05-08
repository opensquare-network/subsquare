import { filter, find, uniqBy } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import {
  allWallets,
  coinbaseWallet,
  metamask,
} from "next-common/utils/consts/connect";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnect } from "wagmi";

const popularWallets = [metamask, coinbaseWallet];

export function useEVMWalletOptions() {
  const { connectors } = useConnect();
  const { chainType } = useChainSettings();

  const showTalisman = chainType === ChainTypes.ETHEREUM;
  const supportedConnectors = filter(connectors, (c) => {
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
      ...popularWallets,
    ],
    "extensionName",
  );

  return options;
}
