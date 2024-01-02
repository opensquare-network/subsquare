import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import WalletTypes from "./consts/walletTypes";

export default function isUseMetamask() {
  return getCookieConnectedAccount()?.wallet === WalletTypes.METAMASK;
}
