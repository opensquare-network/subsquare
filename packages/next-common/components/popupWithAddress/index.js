import React from "react";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import Popup from "../popup/wrapper/Popup";
import MaybeLogin from "../maybeLogin";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const { accounts: extensionAccounts, detecting: extensionDetecting } =
    useExtensionAccounts("subsquare");

  if (extensionDetecting) {
    return null;
  }

  return (
    <MaybeLogin
      extensionAccounts={extensionAccounts}
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
