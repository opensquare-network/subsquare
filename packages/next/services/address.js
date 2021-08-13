import { encodeAddress } from "@polkadot/keyring";

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
