import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

function Content() {
  const { onInBlock, onFinalized } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx[pallet].register();
    }
  }, [api, pallet]);

  return (
    <>
      {component}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onFinalized}
      />
    </>
  );
}

export default function FellowshipSalaryRegisterPopup(props) {
  return (
    <PopupWithSigner title="Register" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
