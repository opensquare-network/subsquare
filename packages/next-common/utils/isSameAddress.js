import { encodeAddress, isEthereumAddress } from "@polkadot/util-crypto";

// Compare two addresses:
//   - substrate addresses are compared across ss58 formats (re-encoded to
//     prefix 42);
//   - EVM addresses are compared case-insensitively.
//
// Kept as its own lightweight module (only depends on @polkadot/util-crypto)
// so pure logic modules can reuse it without pulling in the whole
// next-common/utils barrel (which drags in JSX-based chain config and breaks
// unit test parsing).
export function isSameAddress(addr1, addr2) {
  if (!addr1 || !addr2) {
    return false;
  }

  if (addr1 === addr2) {
    return true;
  }

  if (isEthereumAddress(addr1) && isEthereumAddress(addr2)) {
    return addr1.toLowerCase() === addr2.toLowerCase();
  }

  try {
    return encodeAddress(addr1, 42) === encodeAddress(addr2, 42);
  } catch {
    return false;
  }
}
