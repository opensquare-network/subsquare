import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx[pallet].register();
    }
  }, [api, pallet]);

  const onInBlock = useClaimantsFellowshipUpdateFunc();

  return (
    <>
      {component}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
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
