import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import ContextPopup from "./contextPopup";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";

export default function MaybeMetamaskSigner({ children }) {
  const accounts = useEVMAccounts();

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      <ContextPopup>{children}</ContextPopup>
    </MaybeSignerConnected>
  );
}
