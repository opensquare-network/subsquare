import WalletTypes from "./consts/walletTypes";
import { CACHE_KEY } from "./constants";
import getStorageAddressInfo from "./getStorageAddressInfo";

export default function isUseTalisman() {
  return (
    getStorageAddressInfo(CACHE_KEY.lastConnectedAccount)?.wallet ===
    WalletTypes.TALISMAN
  );
}
