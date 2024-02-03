import React from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import Popup from "../popup/wrapper/Popup";
import { useMetaMaskAccounts } from "../../utils/metamask";

export default function MaybeMetamaskSigner({
  onClose,
  autoCloseAfterLogin,
  title,
  wide,
  maskClosable,
  className,
  children,
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
      <Popup
        wide={wide}
        onClose={onClose}
        title={title}
        maskClosable={maskClosable}
        className={className}
      >
        {children}
      </Popup>
    </MaybeSignerConnected>
  );
}
