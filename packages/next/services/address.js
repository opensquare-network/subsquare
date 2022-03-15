import { encodeAddress } from "@polkadot/keyring";
import { SS58Prefix, Chains } from "next-common/utils/constants";

export const encodeAddressToChain = (address, chain) => {
  let ss58Prefix;
  if (process.env.NEXT_PUBLIC_SS58_PREFIX) {
    ss58Prefix = parseInt(process.env.NEXT_PUBLIC_SS58_PREFIX);
  } else {
    ss58Prefix = SS58Prefix[chain];
  }

  try {
    return encodeAddress(address, ss58Prefix);
  } catch {
    return "";
  }
};

export const encodeSubstrateAddress = (address) => {
  return encodeAddressToChain(address, Chains.substrate);
};
