import WalletTypes from "./consts/walletTypes";

export default function isUseMetamask() {
  return localStorage.lastLoginExtension === WalletTypes.METAMASK;
}
