import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybeLoginPolkadot from "./maybeLoginPolkadot";
import MaybeLoginMetamask from "./maybeLoginMetamask";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAddress } from "next-common/context/connectedAddress";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const loginUser = useUser();
  const connectedAddress = useConnectedAddress();

  if (!loginUser && !connectedAddress) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  if (connectedAddress?.extensionName === WalletTypes.METAMASK) {
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
