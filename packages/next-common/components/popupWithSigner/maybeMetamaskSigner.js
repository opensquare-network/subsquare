import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";

export default function MaybeMetamaskSigner({ children }) {
  const accounts = useEVMAccounts();

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      {children}
    </MaybeSignerConnected>
  );
}
