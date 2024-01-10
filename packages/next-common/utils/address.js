import { decodeAddress } from "@polkadot/util-crypto";
import { encodeAddressToChain } from "next-common/services/address";
import { isEthereumAddress } from "@polkadot/util-crypto";
import Chains from "./consts/chains";
import { evmToSubstrateAddress } from "./hydradxUtil";

export function addressToPublicKey(address) {
  return Buffer.from(decodeAddress(address)).toString("hex");
}

export function normalizeAddress(address) {
  if (!address) {
    return address;
  }

  if (isEthereumAddress(address)) {
    if (process.env.NEXT_PUBLIC_CHAIN === Chains.hydradx) {
      return evmToSubstrateAddress(address);
    }
    return address;
  }

  return encodeAddressToChain(address, process.env.NEXT_PUBLIC_CHAIN);
}
