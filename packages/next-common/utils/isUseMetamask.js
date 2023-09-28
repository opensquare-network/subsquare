import { CACHE_KEY } from "./constants";
import WalletTypes from "./consts/walletTypes";
import getStorageAddressInfo from "./getStorageAddressInfo";

export default function isUseMetamask() {
  return (
    getStorageAddressInfo(CACHE_KEY.lastConnectedAddress)?.wallet ===
    WalletTypes.METAMASK
  );
}
