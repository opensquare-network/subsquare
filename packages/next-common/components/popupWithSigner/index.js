import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { useConnectedWallet } from "next-common/context/connectedWallet";

export default function PopupWithSigner({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const loginUser = useUser();
  const connectedWallet = useConnectedWallet();

  if (!loginUser && !connectedWallet) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  if (connectedWallet?.wallet === WalletTypes.METAMASK) {
    return (
      <MaybeMetamaskSigner
        onClose={onClose}
        autoCloseAfterLogin={autoCloseAfterLogin}
        title={title}
        Component={Component}
        {...props}
      />
    );
  }

  return (
    <MaybePolkadotSigner
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
      title={title}
      Component={Component}
      {...props}
    />
  );
}
