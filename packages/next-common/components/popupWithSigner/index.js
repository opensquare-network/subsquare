import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import CanBeAnyWalletSigner from "./canBeAnyWalletSigner";
import { isKeyRegisteredUser } from "next-common/utils";
import { PopupContextProvider } from "../popup/wrapper/context";

function PopupImpl({ children }) {
  const user = useUser();
  const { connectedAccount, lastConnectedAccount } =
    useConnectedAccountContext();

  if (!user) {
    return <SelectWalletPopup title="" />;
  }

  if (!isKeyRegisteredUser(user) && !connectedAccount) {
    return <CanBeAnyWalletSigner>{children}</CanBeAnyWalletSigner>;
  }

  if (lastConnectedAccount?.wallet === WalletTypes.METAMASK) {
    return <MaybeMetamaskSigner>{children}</MaybeMetamaskSigner>;
  }

  return <MaybePolkadotSigner>{children}</MaybePolkadotSigner>;
}

export default function PopupWithSigner({ children, ...props }) {
  return (
    <PopupContextProvider params={props}>
      <PopupImpl>{children}</PopupImpl>
    </PopupContextProvider>
  );
}
