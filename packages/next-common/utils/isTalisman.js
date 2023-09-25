import { getStorageLastConnectedAddress } from "next-common/context/connectedAddress";
import WalletTypes from "./consts/walletTypes";

export default function isUseTalisman() {
  return getStorageLastConnectedAddress()?.wallet === WalletTypes.TALISMAN;
}
