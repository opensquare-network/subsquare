import React from "react";
import MaybeLogin from "../maybeLogin";
import Popup from "../popup/wrapper/Popup";
import { useMetaMaskAccounts } from "../../utils/metamask";

export default function MaybeLoginMetamask({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  ...props
}) {
  const metamaskAccounts = useMetaMaskAccounts(true);

  return (
    <MaybeLogin
      accounts={metamaskAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup onClose={onClose} title={title}>
        <Component
          onClose={onClose}
          extensionAccounts={metamaskAccounts}
          {...props}
        />
      </Popup>
    </MaybeLogin>
  );
}
