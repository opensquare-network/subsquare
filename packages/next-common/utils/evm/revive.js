import { hexToU8a } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";

const ACCOUNT_ID_LENGTH = 32;
const ETH_DERIVED_SUFFIX_BYTE = 0xee;

// pallet-revive derives an AccountId32 account for an EVM address by
// suffixing its 20 bytes with 12 0xEE bytes, see
// https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/revive/src/address.rs
export function reviveEvmToSubstrateAddress(evmAddress, ss58Format) {
  const accountId = new Uint8Array(ACCOUNT_ID_LENGTH).fill(
    ETH_DERIVED_SUFFIX_BYTE,
  );
  accountId.set(hexToU8a(evmAddress), 0);

  return encodeAddress(accountId, ss58Format);
}
