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

export const encodeKusamaAddress = (address) => {
  return encodeAddressToChain(address, Chains.kusama);
};

export const encodePolkadotAddress = (address) => {
  return encodeAddressToChain(address, Chains.polkadot);
};

export const encodeSubstrateAddress = (address) => {
  return encodeAddressToChain(address, Chains.substrate);
};

export const encodeKaruraAddress = (address) => {
  return encodeAddressToChain(address, Chains.karura);
};

export const encodeAcalaAddress = (address) => {
  return encodeAddressToChain(address, Chains.acala);
};

export const encodeKhalaAddress = (address) => {
  return encodeAddressToChain(address, Chains.khala);
};

export const encodeBasiliskAddress = (address) => {
  return encodeAddressToChain(address, Chains.basilisk);
};

export const encodeKabochaAddress = (address) => {
  return encodeAddressToChain(address, Chains.kabocha);
};

export const encodeBifrostAddress = (address) => {
  return encodeAddressToChain(address, Chains.bifrost);
};

export const encodeKintsugiAddress = (address) => {
  return encodeAddressToChain(address, Chains.kintsugi);
};
