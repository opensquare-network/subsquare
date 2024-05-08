import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

function Content() {
  const { onClose, onFinalized } = usePopupParams();
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    return api.tx.fellowshipSalary?.bump();
  }, [api]);

  return (
    <>
      <Signer title="Origin" />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onClose={onClose}
        onFinalized={onFinalized}
      />
    </>
  );
}

export default function FellowshipSalaryBumpPopup({ onClose, onFinalized }) {
  return (
    <PopupWithSigner title="Bump" onClose={onClose} onFinalized={onFinalized}>
      <Content />
    </PopupWithSigner>
  );
}
