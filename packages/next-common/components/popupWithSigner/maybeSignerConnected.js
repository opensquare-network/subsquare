import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { SignerContextProvider } from "./context";
import { useConnectedWallet } from "next-common/context/connectedWallet";

export default function MaybeSignerConnected({
  children,
  extensionAccounts,
  onClose,
}) {
  const loginUser = useUser();
  const connectedWallet = useConnectedWallet();

  if (
    !(loginUser?.address || connectedWallet) ||
    !extensionAccounts?.find(
      (acc) =>
        isSameAddress(acc.address, loginUser?.address) ||
        isSameAddress(acc.address, connectedWallet?.address),
    )
  ) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      {children}
    </SignerContextProvider>
  );
}
