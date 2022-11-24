import React, { useRef } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import NoExtension from "./noExtension";
import Inaccessible from "./inaccessible";
import NoAccounts from "./noAccounts";
import Popup from "../popup/wrapper/Popup";
import { useUser } from "../../context/user/index.js";
import ConnectWallet from "../connectWallet";
import { emptyFunction, isSameAddress } from "../../utils/index.js";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
  const loginUser = useUser();
  const ref = useRef();
  useOnClickOutside(ref, () => onClose());

  const [
    extensionAccounts,
    hasExtension,
    isExtensionAccessible,
    extensionDetecting,
  ] = useExtensionAccounts("subsquare");

  if (extensionDetecting) {
    return null;
  }

  let content;

  if (!hasExtension) {
    content = <NoExtension />;
  } else if (!isExtensionAccessible) {
    content = <Inaccessible />;
  } else if (!extensionAccounts || extensionAccounts.length === 0) {
    content = <NoAccounts />;
  } else {
    content = (
      <Component
        onClose={onClose}
        extensionAccounts={extensionAccounts}
        {...props}
      />
    );
  }

  if (
    !loginUser?.address ||
    !extensionAccounts.find((acc) =>
      isSameAddress(acc.address, loginUser.address)
    )
  ) {
    return (
      <ConnectWallet onClose={autoCloseAfterLogin ? onClose : emptyFunction} />
    );
  }

  return (
    <Popup onClose={onClose} title={title}>
      {content}
    </Popup>
  );
}
