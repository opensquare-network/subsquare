import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "./viewfuncs";
import getChainSettings from "./consts/settings";
import ChainTypes from "./consts/chainTypes";

export function getChainAddressType() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return settings.chainType || ChainTypes.SUBSTRATE;
}

export function isAddressTypeSupportedForChain(address) {
  if (!address) {
    return false;
  }

  const chainType = getChainAddressType();
  const isEvm = isEthereumAddress(address);
  const isSubstrate = isPolkadotAddress(address);

  if (chainType === ChainTypes.ETHEREUM) {
    return isEvm;
  }
  if (chainType === ChainTypes.MIXED) {
    return isEvm || isSubstrate;
  }
  return isSubstrate;
}
