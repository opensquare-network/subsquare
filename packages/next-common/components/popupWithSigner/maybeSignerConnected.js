import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { SignerContextProvider } from "./context";
import { useConnectedAccount } from "next-common/context/connectedAccount";

export default function MaybeSignerConnected({
  children,
  extensionAccounts,
  onClose,
}) {
  const loginUser = useUser();
  const connectedAccount = useConnectedAccount();

  if (
    !(loginUser?.address || connectedAccount) ||
    !extensionAccounts?.find(
      (acc) =>
        isSameAddress(acc.address, loginUser?.address) ||
        isSameAddress(acc.address, connectedAccount?.address),
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
