import React from "react";
import { useUser } from "../../context/user/index.js";
import ConnectWallet from "../connectWallet";
import { emptyFunction, isSameAddress } from "../../utils/index.js";

export default function MaybeLogin({
  children,
  accounts,
  onClose,
  autoCloseAfterLogin,
}) {
  const loginUser = useUser();

  if (
    !loginUser?.address ||
    !accounts?.find((acc) => isSameAddress(acc.address, loginUser.address))
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
