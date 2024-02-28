import { decodeAddress } from "@polkadot/util-crypto";
import { encodeAddressToChain } from "next-common/services/address";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { evmToSubstrateAddress } from "./hydradxUtil";
import isHydradx from "./isHydradx";

export function addressToPublicKey(address) {
  return Buffer.from(decodeAddress(address)).toString("hex");
}

export function normalizeAddress(address) {
  if (!address) {
    return address;
  }

  if (isEthereumAddress(address)) {
    if (isHydradx()) {
      return evmToSubstrateAddress(address);
    }
    return address;
  }

  return encodeAddressToChain(address, process.env.NEXT_PUBLIC_CHAIN);
}
