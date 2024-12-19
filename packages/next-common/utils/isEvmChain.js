import getChainSettings from "./consts/settings";
import ChainTypes from "./consts/chainTypes";

export default function isEvmChain() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return settings?.chainType === ChainTypes.ETHEREUM;
}

export function isSupportSubstrateThroughEthereumAddress() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return settings?.substrateThroughEthereumAddress;
}

export function isDisabledEvmWallet() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return settings?.disabledEvmWallet;
}
