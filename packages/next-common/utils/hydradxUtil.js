import { Buffer } from "buffer";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { getAddress as getEvmAddress } from "ethers";
import { isPolkadotAddress } from "./viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import isHydradx from "./isHydradx";
import { addressEllipsis } from ".";

const HYDRA_ADDRESS_PREFIX = 63;
const prefixBytes = Buffer.from("ETH\0");
const suffixBytes = Buffer.alloc(8);

export function safeConvertAddressH160(value) {
  try {
    return getEvmAddress(value?.toLowerCase());
  } catch {
    return null;
  }
}

export function evmToSubstrateAddress(address) {
  if (!address) {
    return;
  }
  if (isPolkadotAddress(address)) {
    return address;
  }
  const addressBytes = Buffer.from(address.slice(2), "hex");
  return encodeAddress(
    new Uint8Array(Buffer.concat([prefixBytes, addressBytes, suffixBytes])),
    HYDRA_ADDRESS_PREFIX,
  );
}

export function substrateToEvmAddress(address) {
  if (!address) {
    return;
  }
  if (isEthereumAddress(address)) {
    return address;
  }
  const decodedBytes = decodeAddress(address);
  const addressBytes = decodedBytes.slice(
    prefixBytes.length,
    -suffixBytes.length,
  );
  return (
    safeConvertAddressH160(Buffer.from(addressBytes).toString("hex")) ?? ""
  );
}

export function checkIfShouldConvertToEvmAddress(address) {
  if (!isHydradx() || !isPolkadotAddress(address)) {
    return false;
  }
  const decodedBytes = decodeAddress(address);
  const addressHex = Buffer.from(decodedBytes).toString("hex");
  if (
    addressHex.startsWith(prefixBytes.toString("hex")) &&
    addressHex.endsWith(suffixBytes.toString("hex"))
  ) {
    return true;
  }
  return false;
}

export function tryConvertToEvmAddress(address) {
  if (!address) {
    return address;
  }
  if (checkIfShouldConvertToEvmAddress(address)) {
    return substrateToEvmAddress(address);
  }
  return address;
}

export function tryConvertToSubstrateAddress(address) {
  if (!address) {
    return address;
  }
  if (isEthereumAddress(address)) {
    if (isHydradx()) {
      return evmToSubstrateAddress(address);
    }
    return getEvmAddress(address);
  }
  return address;
}

export function getEvmSignerAddress(address) {
  if (isHydradx() && !isEthereumAddress(address)) {
    return substrateToEvmAddress(address);
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
