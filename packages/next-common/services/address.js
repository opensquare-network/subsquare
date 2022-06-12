import { encodeAddress } from "@polkadot/keyring";
import getChainSettings from "../utils/consts/settings";

export const encodeAddressToChain = (address, chain) => {
  let ss58Prefix;
  if (process.env.NEXT_PUBLIC_SS58_PREFIX) {
    ss58Prefix = parseInt(process.env.NEXT_PUBLIC_SS58_PREFIX);
  } else {
    const settings = getChainSettings(chain);
    ss58Prefix = settings.ss58Format;
  }

  try {
    return encodeAddress(address, ss58Prefix);
  } catch {
    return "";
  }
};
