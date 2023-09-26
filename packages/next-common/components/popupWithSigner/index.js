import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAddress } from "next-common/context/connectedAddress";

export default function PopupWithSigner({
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

  //TODO: handle case of user logged in but connected address is empty

  if (connectedAddress?.wallet === WalletTypes.METAMASK) {
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
