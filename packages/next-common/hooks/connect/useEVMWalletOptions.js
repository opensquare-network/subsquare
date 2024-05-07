import { filter, find, kebabCase } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { allWallets } from "next-common/utils/consts/connect";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnect } from "wagmi";

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

  const options = supportedConnectors.map((connector) => {
    const matched = find(allWallets, {
      extensionName: kebabCase(connector.name.toLowerCase()),
    });
    const logo = matched?.logo;

    return {
      title: connector.name,
      extensionName: connector.name.toLowerCase(),
      logo,
      connector,
    };
  });

  return options;
}
