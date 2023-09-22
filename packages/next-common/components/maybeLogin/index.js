import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { useConnectedWallet } from "next-common/context/connectedWallet";

export default function MaybeLogin({ children, accounts, onClose }) {
  const loginUser = useUser();
  const connectedWallet = useConnectedWallet();

  const address = loginUser?.address || connectedWallet;

  if (
    !address ||
    !accounts?.find((acc) => isSameAddress(acc.address, address))
  ) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  return children;
}
