import { encodeAddress } from "@polkadot/util-crypto";

// votingFor storage: (account, trackId, votingOf)
// key u8a[] composition: section + method = 32; account twox64 hash = 8, account = 32;
/**
 * key u8a[] composition:
 * section + method = 32;
 * account twox64 hash = 8, account = 32;
 * trackId twox64 hash = 8, trackId(u16) = 2;
 *
 * total: 32 + 40 + 10 = 82;
 */

export function extractAddressAndTrackId(storageKey = [], api) {
  const sectionRemoved = storageKey.slice(32);
  const accountHashRemoved = sectionRemoved.slice(8);
  const accountU8a = accountHashRemoved.slice(0, 32);

  const accountRemoved = accountHashRemoved.slice(32);
  const classIdU8a = accountRemoved.slice(8);

  const address = encodeAddress(accountU8a, api.registry.chainSS58);
  const trackId = api.registry.createType("U16", classIdU8a).toNumber();

  return {
    address,
    trackId,
  };
}
