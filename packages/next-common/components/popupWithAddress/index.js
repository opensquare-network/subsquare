import React from "react";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import Popup from "../popup/wrapper/Popup";
import MaybeLogin from "../maybeLogin";
import { useMetaMaskAccounts } from "next-common/utils/metamask";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const { accounts: polkadotExtensionAccounts, detecting: extensionDetecting } =
    useExtensionAccounts("subsquare");
  const polkadotAccounts = polkadotExtensionAccounts.map((item) => ({
    ...item,
    name: item.meta.name,
  }));

  const metamaskAccounts = useMetaMaskAccounts();
  const extensionAccounts = [...polkadotAccounts, ...metamaskAccounts];

  if (extensionDetecting) {
    return null;
  }

  return (
    <MaybeLogin
      polkadotAccounts={polkadotAccounts}
      metamaskAccounts={metamaskAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup onClose={onClose} title={title}>
        <Component
          onClose={onClose}
          extensionAccounts={extensionAccounts}
          {...props}
        />
      </Popup>
    </MaybeLogin>
  );
}
