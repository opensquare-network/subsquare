import { Buffer } from "buffer";
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto";
import { getAddress as getEvmAddress } from "ethers";

const HYDRA_ADDRESS_PREFIX = 63;
const prefixBytes = Buffer.from("ETH\0");

export function safeConvertAddressH160(value) {
  try {
    return getEvmAddress(value?.toLowerCase());
  } catch {
    return null;
  }
}

export function evmToSubstrateAddress(address) {
  const addressBytes = Buffer.from(address.slice(2), "hex");
  return encodeAddress(
    new Uint8Array(Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)])),
    HYDRA_ADDRESS_PREFIX,
  );
}

export function substrateToEvmAddress(address) {
  const decodedBytes = decodeAddress(address);
  const addressBytes = decodedBytes.slice(prefixBytes.length, -8);
  return (
    safeConvertAddressH160(Buffer.from(addressBytes).toString("hex")) ?? ""
  );
}
