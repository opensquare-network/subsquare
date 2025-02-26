import React from "react";
import SignerPopupWrapper from "./signerPopupWrapper";
import ContextPopup from "./contextPopup";
import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";

export default function PopupWithSigner({ children, ...props }) {
  return (
    <SignerPopupWrapper {...props}>
      <ContextPopup>
        <ExtensionUpdatePrompt />
        {children}
      </ContextPopup>
    </SignerPopupWrapper>
  );
}
