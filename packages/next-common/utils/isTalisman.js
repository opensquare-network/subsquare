import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import WalletTypes from "./consts/walletTypes";

export default function isUseTalisman() {
  return getCookieConnectedAccount()?.wallet === WalletTypes.TALISMAN;
}
