import { Buffer } from "buffer";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { ethers } from "ethers";
import { isPolkadotAddress } from "./viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import isHydradx from "./isHydradx";

const HYDRA_ADDRESS_PREFIX = 63;
const prefixBytes = Buffer.from("ETH\0");
const suffixBytes = Buffer.alloc(8);

export function safeConvertAddressH160(value) {
  try {
    return ethers.utils.getAddress(value?.toLowerCase());
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

  try {
    const decodedBytes = decodeAddress(address);
    const addressHex = Buffer.from(decodedBytes).toString("hex");
    if (
      addressHex.startsWith(prefixBytes.toString("hex")) &&
      addressHex.endsWith(suffixBytes.toString("hex"))
    ) {
      return true;
    }
  } catch (e) {
    // ignore
  }

  return false;
}
