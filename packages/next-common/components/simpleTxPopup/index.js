import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { noop } from "lodash-es";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import AdvanceSettings from "../summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "../estimatedGas";

function PopupContent({ children, confirmText, noSwitchSigner, ...props }) {
  const { getTxFunc } = props;

  const childrenArray = React.Children.toArray(children);
  const advanceSettingsChild = childrenArray.find(
    (child) => child.type === SimpleTxPopup.AdvanceSettings,
  );
  const otherChildren = childrenArray.filter(
    (child) => child.type !== SimpleTxPopup.AdvanceSettings,
  );

  return (
    <>
      <SignerWithBalance noSwitchSigner={noSwitchSigner} />
      {otherChildren}
      <AdvanceSettings>
        {advanceSettingsChild?.props.children}
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

SimpleTxPopup.AdvanceSettings = function SimpleTxPopupAdvanceSettings({
  children,
}) {
  return children;
};
