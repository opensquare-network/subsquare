import WalletTypes from "./consts/walletTypes";
import { CACHE_KEY } from "./constants";
import getStorageAddressInfo from "./getStorageAddressInfo";

export default function isUseMetamask() {
  return (
    getStorageAddressInfo(CACHE_KEY.lastConnectedAddress)?.wallet ===
    WalletTypes.METAMASK
  );
}
