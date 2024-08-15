import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "./signerWithBalance";
import { noop } from "lodash-es";
import TxSubmissionButton from "../common/tx/txSubmissionButton";

function PopupContent({
  children,
  getTxFunc,
  confirmText,
  onSubmitted,
  onInBlock,
  onFinalized,
}) {
  return (
    <>
      <SignerWithBalance />
      {children}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        title={confirmText}
        onSubmitted={onSubmitted}
        onInBlock={onInBlock}
        onFinalized={onFinalized}
      />
    </>
  );
}

export default function SignerPopupV2({
  children,
  getTxFunc = noop,
  confirmText = "Confirm",
  onSubmitted = noop,
  onInBlock = noop,
  onFinalized = noop,
  onClose = noop,
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
      >
        {children}
      </PopupContent>
    </PopupWithSigner>
  );
}
