import { ethers } from "ethers";
import ChainTypes from "./consts/chainTypes";
import getChainSettings from "./consts/settings";
import { isPolkadotAddress } from "./viewfuncs";

export default function getStorageAddressInfo(key) {
  const data = localStorage.getItem(key);
  if (!data) {
    return;
  }

  let info;
  try {
    info = JSON.parse(data);
  } catch (e) {
    return;
  }

  // Check data
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const chainSettings = getChainSettings(chain);

  if (
    chainSettings.chainType === ChainTypes.ETHEREUM &&
    !ethers.isAddress(info.address)
  ) {
    return;
  }

  if (
    ![ChainTypes.ETHEREUM, ChainTypes.MIXED].includes(
      chainSettings.chainType,
    ) &&
    !isPolkadotAddress(info.address)
  ) {
    return;
  }

  return info;
}
