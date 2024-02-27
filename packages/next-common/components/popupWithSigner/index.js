import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import CanBeAnyWalletSigner from "./canBeAnyWalletSigner";
import { isKeyRegisteredUser } from "next-common/utils";

export default function PopupWithSigner({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const user = useUser();
  const { connectedAccount, lastConnectedAccount } =
    useConnectedAccountContext();

  if (!user) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  if (!isKeyRegisteredUser(user) && !connectedAccount) {
    return (
      <CanBeAnyWalletSigner
        onClose={onClose}
        autoCloseAfterLogin={autoCloseAfterLogin}
        title={title}
        Component={Component}
        {...props}
      />
    );
  }

  if (lastConnectedAccount?.wallet === WalletTypes.METAMASK) {
    return (
      <MaybeMetamaskSigner onClose={onClose} title={title} {...props}>
        <Component onClose={onClose} {...props} />
      </MaybeMetamaskSigner>
    );
  }

  return (
    <MaybePolkadotSigner onClose={onClose} title={title} {...props}>
      <Component onClose={onClose} {...props} />
    </MaybePolkadotSigner>
  );
}
