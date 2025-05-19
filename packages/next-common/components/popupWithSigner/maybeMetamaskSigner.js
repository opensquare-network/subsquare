import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useEVMAccounts } from "next-common/hooks/connect/useEVMAccounts";
import { usePopupParams } from "./context";

export default function MaybeMetamaskSigner({ children }) {
  const { loadingContent = null } = usePopupParams();
  const { accounts, loading } = useEVMAccounts();

  if (loading) {
    return loadingContent;
  }

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      {children}
    </MaybeSignerConnected>
  );
}
