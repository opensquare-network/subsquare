import { keccakAsU8a } from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";

const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

// EIP-55 checksum formatting, equivalent to ethers.getAddress.
// Implemented locally so that importing it doesn't pull the whole ethers package
// into the page bundle (it used to be the only ethers usage in these utils).
export function checksumAddress(address) {
  if (typeof address !== "string" || !EVM_ADDRESS_REGEX.test(address)) {
    throw new Error(`invalid address (${address})`);
  }

  const lower = address.slice(2).toLowerCase();
  const hash = u8aToHex(keccakAsU8a(lower), -1, false);
  let result = "0x";
  for (let i = 0; i < lower.length; i++) {
    result += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i];
  }
  return result;
}
