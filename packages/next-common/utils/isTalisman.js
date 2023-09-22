import { CACHE_KEY } from "./constants";
import WalletTypes from "./consts/walletTypes";

export default function isUseTalisman() {
  return (
    localStorage.getItem(CACHE_KEY.lastLoginExtension) === WalletTypes.TALISMAN
  );
}
