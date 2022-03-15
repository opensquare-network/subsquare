import { encodeAddress } from "@polkadot/keyring";
import { SS58Prefix } from "next-common/utils/constants";

export const encodeAddressToChain = (address, chain) => {
  try {
    return encodeAddress(address, SS58Prefix[chain]);
  } catch {
    return "";
  }
};

export const encodeKusamaAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.kusama);
  } catch {
    return "";
  }
};

export const encodePolkadotAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.polkadot);
  } catch {
    return "";
  }
};

export const encodeSubstrateAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.substrate);
  } catch {
    return "";
  }
};

export const encodeKaruraAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.karura);
  } catch {
    return "";
  }
};

export const encodeAcalaAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.acala);
  } catch {
    return "";
  }
};

export const encodeKhalaAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.khala);
  } catch {
    return "";
  }
};

export const encodeBasiliskAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.basilisk);
  } catch {
    return "";
  }
};

export const encodeKabochaAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.kabocha);
  } catch {
    return "";
  }
};

export const encodeBifrostAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.bifrost);
  } catch {
    return "";
  }
};

export const encodeKintsugiAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.kintsugi);
  } catch {
    return "";
  }
};

export const encodePolkadexAddress = (address) => {
  try {
    return encodeAddress(address, SS58Prefix.polkadex);
  } catch {
    return "";
  }
};
