import { getAddress as getEvmAddress } from "ethers";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { addressEllipsis } from ".";
import {
  checkIfShouldConvertToEvmAddress as hydrationChainCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as hydrationChainEvmToSubstrateAddress,
  substrateToEvmAddress as hydrationChainSubstrateToEvmAddress,
} from "./hydrationChainUtil";
import {
  checkIfShouldConvertToEvmAddress as centrifugeCheckIfShouldConvertToEvmAddress,
  evmToSubstrateAddress as centrifugeEvmToSubstrateAddress,
  substrateToEvmAddress as centrifugeSubstrateToEvmAddress,
} from "./centrifugeUtil";
import isCentrifuge from "./isCentrifuge";
import isHydrationChain from "./isHydrationChain";

export function tryConvertToEvmAddress(address) {
  if (!address) {
    return address;
  }
  if (isHydrationChain()) {
    if (hydrationChainCheckIfShouldConvertToEvmAddress(address)) {
      return hydrationChainSubstrateToEvmAddress(address);
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
    if (isHydrationChain()) {
      return hydrationChainEvmToSubstrateAddress(address);
    }
    if (isCentrifuge()) {
      return centrifugeEvmToSubstrateAddress(address);
    }
    return getEvmAddress(address);
  }
  return address;
}

export function getEvmSignerAddress(address) {
  if (isHydrationChain() && !isEthereumAddress(address)) {
    return hydrationChainSubstrateToEvmAddress(address);
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
