import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import { useCallback } from "react";

function Content() {
  const { onFinalized } = usePopupParams();
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(async () => {
    if (!api) {
      return;
    }
    return api.tx[pallet]?.bump();
  }, [api, pallet]);

  return (
    <>
      <Signer />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
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
