import { ethers } from "ethers";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { addressEllipsis } from ".";
import {
  checkIfShouldConvertToEvmAddress as hydradxCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as hydradxEvmToSubstrateAddress,
  substrateToEvmAddress as hydradxSubstrateToEvmAddress,
} from "./hydradxUtil";
import {
  checkIfShouldConvertToEvmAddress as centrifugeCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as centrifugeEvmToSubstrateAddress,
  substrateToEvmAddress as centrifugeSubstrateToEvmAddress,
} from "./centrifugeUtil";
import isCentrifuge from "./isCentrifuge";
import isHydradx from "./isHydradx";

export function tryConvertToEvmAddress(address) {
  if (!address) {
    return address;
  }
  if (isHydradx()) {
    if (hydradxCheckIfShouldConvertToEvmAddress(address)) {
      return hydradxSubstrateToEvmAddress(address);
    }
  }
  if (isCentrifuge()) {
    if (centrifugeCheckIfShouldConvertToEvmAddress(address)) {
      return centrifugeSubstrateToEvmAddress(address);
    }
  }
  return address;
}

export function tryConvertToSubstrateAddress(address) {
  if (!address) {
    return address;
  }
  if (isEthereumAddress(address)) {
    if (isHydradx()) {
      return hydradxEvmToSubstrateAddress(address);
    }
    if (isCentrifuge()) {
      return centrifugeEvmToSubstrateAddress(address);
    }
    return ethers.getAddress(address);
  }
  return address;
}

export function getEvmSignerAddress(address) {
  if (isHydradx() && !isEthereumAddress(address)) {
    return hydradxSubstrateToEvmAddress(address);
  }
  if (isCentrifuge() && !isEthereumAddress(address)) {
    return centrifugeSubstrateToEvmAddress(address);
  }
  return address;
}

export function getAddressHint(address) {
  let addressHint = "--";

  if (address) {
    const maybeEvmAddress = tryConvertToEvmAddress(address);

    addressHint = addressEllipsis(maybeEvmAddress);
    if (maybeEvmAddress !== address) {
      addressHint += ` (${addressEllipsis(address)})`;
    }
  }

  return addressHint;
}
