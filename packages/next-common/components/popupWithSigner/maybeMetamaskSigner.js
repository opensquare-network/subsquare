import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import ContextPopup from "./contextPopup";
import { useAccounts } from "next-common/hooks/connect/evm/useAccounts";

export default function MaybeMetamaskSigner({ children }) {
  const accounts = useAccounts();

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      <ContextPopup>{children}</ContextPopup>
    </MaybeSignerConnected>
  );
}
