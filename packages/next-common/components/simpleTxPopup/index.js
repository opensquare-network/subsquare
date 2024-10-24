import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { noop } from "lodash-es";
import TxSubmissionButton from "../common/tx/txSubmissionButton";

function PopupContent({ children, confirmText, noSwitchSigner, ...props }) {
  return (
    <>
      <SignerWithBalance noSwitchSigner={noSwitchSigner} />
      {children}
      <TxSubmissionButton title={confirmText} {...props} />
    </>
  );
}

export default function SimpleTxPopup({
  children,
  getTxFunc = noop,
  confirmText = "Confirm",
  onSubmitted = noop,
  onInBlock = noop,
  onFinalized = noop,
  onClose = noop,
  noSwitchSigner,
  ...props
}) {
  return (
    <PopupWithSigner onClose={onClose} {...props}>
      <PopupContent
        getTxFunc={getTxFunc}
        confirmText={confirmText}
        onSubmitted={onSubmitted}
        onInBlock={onInBlock}
        onFinalized={onFinalized}
        noSwitchSigner={noSwitchSigner}
      >
        {children}
      </PopupContent>
    </PopupWithSigner>
  );
}
