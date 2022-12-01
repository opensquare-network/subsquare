import React, { useEffect } from "react";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import MaybeLogin from "../maybeLogin";

function ActionComponent({ actionCallback, onClose }) {
  useEffect(() => {
    onClose();
    actionCallback();
  }, []);

  return null;
}

export default function MaybeLoginWithAction({
  actionCallback,
  onClose,
  autoCloseAfterLogin,
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
      <ActionComponent actionCallback={actionCallback} onClose={onClose} />
    </MaybeLogin>
  );
}
