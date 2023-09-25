import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import Popup from "../popup/wrapper/Popup";
import { useMetaMaskAccounts } from "../../utils/metamask";

export default function MaybeMetamaskSigner({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  ...props
}) {
  const [metamaskAccounts, isLoading] = useMetaMaskAccounts(true);

  if (isLoading) {
    return null;
  }

  return (
    <MaybeSignerConnected
      extensionAccounts={metamaskAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup onClose={onClose} title={title}>
        <Component onClose={onClose} {...props} />
      </Popup>
    </MaybeSignerConnected>
  );
}
