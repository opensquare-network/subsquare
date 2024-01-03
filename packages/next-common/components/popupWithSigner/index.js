import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";

export default function PopupWithSigner({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const user = useUser();
  const { lastConnectedAccount } = useConnectedAccountContext();

  if (!user) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  if (lastConnectedAccount?.wallet === WalletTypes.METAMASK) {
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
