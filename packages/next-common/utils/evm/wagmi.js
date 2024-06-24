import { defineChain, hexToNumber, isHex } from "viem";

/**
 * @param {typeof import('../consts/settings/hydradx').default.ethereumNetwork} ethereumNetwork
 */
export function compatWagmiChainConfig(ethereumNetwork) {
  if (!ethereumNetwork) {
    return;
  }

  const id = isHex(ethereumNetwork.chainId)
    ? hexToNumber(ethereumNetwork.chainId)
    : ethereumNetwork.chainId;

  return defineChain({
    id,
    name: ethereumNetwork.chainName,
    nativeCurrency: ethereumNetwork.nativeCurrency,
    rpcUrls: {
      default: {
        http: ethereumNetwork.rpcUrls,
      },
    },
    blockExplorers: {
      default: {
        name: "Explorer",
        url: ethereumNetwork.blockExplorerUrls[0],
      },
    },
  });
}
