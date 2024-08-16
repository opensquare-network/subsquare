import { Buffer } from "buffer";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { ethers } from "ethers";
import { isPolkadotAddress } from "./viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import isCentrifuge from "./isCentrifuge";

const CENTRIFUGE_ADDRESS_PREFIX = 36;
const zeroBytes = Buffer.alloc(6);
const chainId = Buffer.from("07ef", "hex");
const evmTagBytes = Buffer.from("EVM\0");
const suffixBytes = Buffer.concat([zeroBytes, chainId, evmTagBytes]);

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
  const publicKey = Buffer.concat([addressBytes, suffixBytes]);
  return encodeAddress(new Uint8Array(publicKey), CENTRIFUGE_ADDRESS_PREFIX);
}

export function substrateToEvmAddress(address) {
  if (!address) {
    return;
  }
  if (isEthereumAddress(address)) {
    return address;
  }
  const decodedBytes = decodeAddress(address);
  const addressBytes = decodedBytes.slice(0, -suffixBytes.length);
  return (
    safeConvertAddressH160(Buffer.from(addressBytes).toString("hex")) ?? ""
  );
}

export function checkIfShouldConvertToEvmAddress(address) {
  if (!isCentrifuge() || !isPolkadotAddress(address)) {
    return false;
  }

  try {
    const decodedBytes = decodeAddress(address);
    const addressHex = Buffer.from(decodedBytes).toString("hex");
    if (addressHex.endsWith(suffixBytes.toString("hex"))) {
      return true;
    }
  } catch (e) {
    // ignore
  }

  return false;
}
