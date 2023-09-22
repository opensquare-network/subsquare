import { CACHE_KEY } from "./constants";
import WalletTypes from "./consts/walletTypes";

export default function isUseMetamask() {
  return (
    localStorage.getItem(CACHE_KEY.lastLoginExtension) === WalletTypes.METAMASK
  );
}
