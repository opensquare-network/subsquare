import WalletTypes from "next-common/utils/consts/walletTypes";
import { createConnector } from "wagmi";
import { injected } from "wagmi/connectors";

/**
 * wrap injected connector as nova
 *
 * @type {injected}
 */
export const nova = (params) => {
  const injectedConnector = injected(params);

  return createConnector((config) => {
    const connector = injectedConnector(config);
    return {
      ...connector,
      id: WalletTypes.NOVA,
      name: "Nova",
    };
  });
};
