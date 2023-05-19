import React from "react";
import { useUser } from "../../context/user/index.js";
import ConnectWallet from "../connectWallet";
import { emptyFunction, isSameAddress } from "../../utils/index.js";
import WalletTypes from "next-common/utils/consts/walletTypes.js";

export default function MaybeLogin({
  children,
  polkadotAccounts,
  metamaskAccounts,
  onClose,
  autoCloseAfterLogin,
}) {
  const loginUser = useUser();
  const lastLoginExtension = localStorage.lastLoginExtension;

  if (
    !loginUser?.address ||
    !(
      (lastLoginExtension !== WalletTypes.METAMASK &&
        polkadotAccounts?.find((acc) =>
          isSameAddress(acc.address, loginUser.address),
        )) ||
      (lastLoginExtension === WalletTypes.METAMASK &&
        metamaskAccounts?.find((acc) =>
          isSameAddress(acc.address, loginUser.address),
        ))
    )
  ) {
    return (
      <ConnectWallet
        onClose={onClose}
        onLoggedIn={autoCloseAfterLogin ? onClose : emptyFunction}
      />
    );
  }

  return children;
}
