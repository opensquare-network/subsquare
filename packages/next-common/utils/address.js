import { decodeAddress } from "@polkadot/util-crypto";

export function addressToPublicKey(address) {
  return Buffer.from(decodeAddress(address)).toString("hex");
}
