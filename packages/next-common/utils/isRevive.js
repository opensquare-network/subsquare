import { isEthereumAddress } from "@polkadot/util-crypto";
import getChainSettings from "./consts/settings";

// pallet-revive is the EVM runtime running on substrate chains, e.g. Polkadot Asset Hub.
export function hasRevive() {
  const settings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  return !!settings?.hasRevive;
}

export default function isReviveEvmAddress(address) {
  return hasRevive() && isEthereumAddress(address);
}
