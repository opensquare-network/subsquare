import React, { useRef } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside.js";
import useExtensionAccounts from "../../utils/hooks/useExtensionAccounts";
import NoExtension from "./noExtension";
import Inaccessible from "./inaccessible";
import NoAccounts from "./noAccounts";
import Popup from "../popup/wrapper/Popup";
import MaybeLogin from "../maybeLogin";

export default function PopupWithAddress({
  Component,
  title,
  onClose,
  autoCloseAfterLogin,
  ...props
}) {
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
  }

  if (content) {
    return (
      <Popup onClose={onClose} title={title}>
        {content}
      </Popup>
    );
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
