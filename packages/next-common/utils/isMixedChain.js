import getChainSettings from "./consts/settings";
import ChainTypes from "./consts/chainTypes";

export default function isMixedChain() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return settings?.chainType === ChainTypes.MIXED;
}
