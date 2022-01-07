import { encodeAddress } from "@polkadot/keyring";
import { SS58Prefix } from "../utils/constants";

export const encodeAddressToChain = (address, chain) => {
  try {
    return encodeAddress(address, SS58Prefix[chain]);
  } catch {
    return "";
  }
};

export const encodeKusamaAddress = (address) => {
  try {
    return encodeAddress(address, 2);
  } catch {
    return "";
  }
};

export const encodePolkadotAddress = (address) => {
  try {
    return encodeAddress(address, 0);
  } catch {
    return "";
  }
};

export const encodeSubstrateAddress = (address) => {
  try {
    return encodeAddress(address, 42);
  } catch {
    return "";
  }
};

export const encodeKaruraAddress = (address) => {
  try {
    return encodeAddress(address, 8);
  } catch {
    return "";
  }
};

export const encodeKhalaAddress = (address) => {
  try {
    return encodeAddress(address, 30);
  } catch {
    return "";
  }
};

export const encodeBasiliskAddress = (address) => {
  try {
    return encodeAddress(address, 10041);
  } catch {
    return "";
  }
};
