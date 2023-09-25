import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { useConnectedAddress } from "next-common/context/connectedAddress";
import { SignerContextProvider } from "./context";

export default function MaybeSignerConnected({
  children,
  extensionAccounts,
  onClose,
}) {
  const loginUser = useUser();
  const connectedAddress = useConnectedAddress();

  if (
    !(loginUser?.address || connectedAddress) ||
    !extensionAccounts?.find(
      (acc) =>
        isSameAddress(acc.address, loginUser?.address) ||
        isSameAddress(acc.address, connectedAddress?.address),
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
