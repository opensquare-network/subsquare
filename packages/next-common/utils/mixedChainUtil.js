import { checksumAddress } from "./evm/checksumAddress";
import { isEthereumAddress } from "@polkadot/util-crypto";
import {
  checkIfShouldConvertToEvmAddress as hydradxCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as hydradxEvmToSubstrateAddress,
  substrateToEvmAddress as hydradxSubstrateToEvmAddress,
} from "./hydradxUtil";
import {
  checkIfShouldConvertToEvmAddress as shibuyaCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as shibuyaEvmToSubstrateAddress,
  substrateToEvmAddress as shibuyaSubstrateToEvmAddress,
} from "./shibuyaUtil";

import isHydradx from "./isHydradx";
import isShibuya from "./isShibuya";

export function tryConvertToEvmAddress(address) {
  if (!address) {
    return address;
  }
  if (isHydradx()) {
    if (hydradxCheckIfShouldConvertToEvmAddress(address)) {
      return hydradxSubstrateToEvmAddress(address);
    }
  }
  if (isShibuya()) {
    if (shibuyaCheckIfShouldConvertToEvmAddress(address)) {
      return shibuyaSubstrateToEvmAddress(address);
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
    if (isShibuya()) {
      return shibuyaEvmToSubstrateAddress(address);
    }
    return checksumAddress(address);
  }
  return address;
}

export function getEvmSignerAddress(address) {
  if (isHydradx() && !isEthereumAddress(address)) {
    return hydradxSubstrateToEvmAddress(address);
  }
  if (isShibuya() && !isEthereumAddress(address)) {
    return shibuyaSubstrateToEvmAddress(address);
  }
  return address;
}
