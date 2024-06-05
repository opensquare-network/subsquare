import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import { useMetaMaskAccounts } from "../../utils/metamask";

export default function MaybeMetamaskSigner({ children }) {
  const [metamaskAccounts, isLoading] = useMetaMaskAccounts(true);

  if (isLoading) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={metamaskAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
