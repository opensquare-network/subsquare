import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useSignetSdk, useSignetAccounts } from "next-common/context/signet";
import { usePopupParams } from "./context";

export default function MaybeSignetSigner({ children }) {
  const { loadingContent = null } = usePopupParams();
  const { loading } = useSignetSdk();
  const signetAccounts = useSignetAccounts();

  if (loading) {
    return loadingContent;
  }

  return (
    <MaybeSignerConnected extensionAccounts={signetAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
