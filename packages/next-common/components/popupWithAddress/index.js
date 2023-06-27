import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybeLoginPolkadot from "./maybeLoginPolkadot";
import MaybeLoginMetamask from "./maybeLoginMetamask";
import ConnectWallet from "../connectWallet";
import { emptyFunction } from "next-common/utils";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const loginUser = useUser();
  const lastLoginExtension = localStorage.lastLoginExtension;

  if (!loginUser) {
    return (
      <ConnectWallet
        onClose={onClose}
        onLoggedIn={autoCloseAfterLogin ? onClose : emptyFunction}
      />
    );
  }

  if (lastLoginExtension === WalletTypes.METAMASK) {
    return (
      <MaybeLoginMetamask
        onClose={onClose}
        autoCloseAfterLogin={autoCloseAfterLogin}
        title={title}
        Component={Component}
        {...props}
      />
    );
  }

  return (
    <MaybeLoginPolkadot
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
      title={title}
      Component={Component}
      {...props}
    />
  );
}
