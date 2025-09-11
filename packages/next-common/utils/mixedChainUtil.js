import { ethers } from "ethers";
import { isEthereumAddress } from "@polkadot/util-crypto";
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
import {
  checkIfShouldConvertToEvmAddress as shibuyaCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as shibuyaEvmToSubstrateAddress,
  substrateToEvmAddress as shibuyaSubstrateToEvmAddress,
} from "./shibuyaUtil";

import isCentrifuge from "./isCentrifuge";
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
  if (isCentrifuge()) {
    if (centrifugeCheckIfShouldConvertToEvmAddress(address)) {
      return centrifugeSubstrateToEvmAddress(address);
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
    if (isCentrifuge()) {
      return centrifugeEvmToSubstrateAddress(address);
    }
    if (isShibuya()) {
      return shibuyaEvmToSubstrateAddress(address);
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
  if (isShibuya() && !isEthereumAddress(address)) {
    return shibuyaSubstrateToEvmAddress(address);
  }
  return address;
}
