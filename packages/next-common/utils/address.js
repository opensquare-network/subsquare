import { decodeAddress } from "@polkadot/util-crypto";
import { encodeAddressToChain } from "next-common/services/address";
import { isEthereumAddress } from "@polkadot/util-crypto";

export function addressToPublicKey(address) {
  return Buffer.from(decodeAddress(address)).toString("hex");
}

export function normalizeAddress(address) {
  if (!isEthereumAddress(address)) {
    return encodeAddressToChain(address, process.env.NEXT_PUBLIC_CHAIN);
  }

  return address;
}
