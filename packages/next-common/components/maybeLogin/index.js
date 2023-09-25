import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAddress } from "next-common/context/connectedAddress";

export default function MaybeLogin({ children, accounts, onClose }) {
  const loginUser = useUser();
  const connectedAddress = useConnectedAddress();

  if (
    !(loginUser?.address || connectedAddress) ||
    !accounts?.find(
      (acc) =>
        isSameAddress(acc.address, loginUser?.address) ||
        isSameAddress(acc.address, connectedAddress),
    )
  ) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  return children;
}
