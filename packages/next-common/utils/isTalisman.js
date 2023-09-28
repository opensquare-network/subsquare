import WalletTypes from "./consts/walletTypes";
import getStorageAddressInfo from "./getStorageAddressInfo";
import { CACHE_KEY } from "./constants";

export default function isUseTalisman() {
  return (
    getStorageAddressInfo(CACHE_KEY.lastConnectedAddress)?.wallet ===
    WalletTypes.TALISMAN
  );
}
