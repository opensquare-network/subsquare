import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { noop } from "lodash-es";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import AdvanceSettings from "../summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "../estimatedGas";

function PopupContent({ children, confirmText, noSwitchSigner, ...props }) {
  const { getTxFunc } = props;
  return (
    <>
      <SignerWithBalance noSwitchSigner={noSwitchSigner} />
      {children}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
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
