import React from "react";
import { useUser } from "next-common/context/user";
import WalletTypes from "next-common/utils/consts/walletTypes";
import MaybePolkadotSigner from "./maybePolkadotSigner";
import MaybeMetamaskSigner from "./maybeMetamaskSigner";
import SelectWalletPopup from "../selectWallet";
import { CACHE_KEY } from "next-common/utils/constants";
import getStorageAddressInfo from "next-common/utils/getStorageAddressInfo";

export default function PopupWithSigner({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const user = useUser();

  if (!user) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  const lastConnectedAddress = getStorageAddressInfo(
    CACHE_KEY.lastConnectedAddress,
  );
  if (lastConnectedAddress?.wallet === WalletTypes.METAMASK) {
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
