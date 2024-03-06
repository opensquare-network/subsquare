import React from "react";
import { useUser } from "../../context/user";
import { isSameAddress } from "../../utils";
import SelectWalletPopup from "../selectWallet";
import { SignerContextProvider, usePopupParams } from "./context";

export default function MaybeSignerConnected({ children, extensionAccounts }) {
  const user = useUser();
  const { onClose } = usePopupParams();

  if (
    !user?.address ||
    !extensionAccounts?.find((acc) => isSameAddress(acc.address, user?.address))
  ) {
    return <SelectWalletPopup onClose={onClose} />;
  }

  return (
    <SignerContextProvider extensionAccounts={extensionAccounts}>
      {children}
    </SignerContextProvider>
  );
}
