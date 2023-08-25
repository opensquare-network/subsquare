import WalletTypes from "./consts/walletTypes";

export default function isUseTalisman() {
  return localStorage.lastLoginExtension === WalletTypes.TALISMAN;
}
