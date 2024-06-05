import React from "react";
import SignerPopupWrapper from "./signerPopupWrapper";
import ContextPopup from "./contextPopup";

export default function PopupWithSigner({ children, ...props }) {
  return (
    <SignerPopupWrapper {...props}>
      <ContextPopup>{children}</ContextPopup>
    </SignerPopupWrapper>
  );
}
