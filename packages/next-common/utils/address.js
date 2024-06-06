import { decodeAddress } from "@polkadot/util-crypto";
import { encodeAddressToChain } from "next-common/services/address";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { evmToSubstrateAddress as hydrationChainEvmToSubstrateAddress } from "./hydradxUtil";
import { evmToSubstrateAddress as centrifugeEvmToSubstrateAddress } from "./centrifugeUtil";
import isHydradx from "./isHydradx";
import isCentrifuge from "./isCentrifuge";

export function addressToPublicKey(address) {
  return Buffer.from(decodeAddress(address)).toString("hex");
}

export function normalizeAddress(address) {
  if (!address) {
    return address;
  }

  if (isEthereumAddress(address)) {
    if (isHydradx()) {
      return hydrationChainEvmToSubstrateAddress(address);
    }
    if (isCentrifuge()) {
      return centrifugeEvmToSubstrateAddress(address);
    }
    return address;
  }

  return encodeAddressToChain(address, process.env.NEXT_PUBLIC_CHAIN);
}
