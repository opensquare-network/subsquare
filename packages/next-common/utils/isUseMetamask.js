import { getStorageLastConnectedAddress } from "next-common/context/connectedAddress";
import WalletTypes from "./consts/walletTypes";

export default function isUseMetamask() {
  return getStorageLastConnectedAddress()?.wallet === WalletTypes.METAMASK;
}
