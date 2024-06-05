import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useSignetSdk, useSignetAccounts } from "next-common/context/signet";

export default function MaybeSignetSigner({ children }) {
  const { loading } = useSignetSdk();
  const signetAccounts = useSignetAccounts();
  if (loading) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={signetAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
