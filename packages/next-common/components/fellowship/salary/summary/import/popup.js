import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";
import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";

function Content() {
  const { component } = useSigner();
  const api = useContextApi();
  const pallet = useSalaryFellowshipPallet();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx[pallet].induct();
    }
  }, [api, pallet]);

  const onInBlock = useClaimantsFellowshipUpdateFunc();

  return (
    <>
      {component}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function FellowshipSalaryImportPopup(props) {
  return (
    <PopupWithSigner title="Induct myself" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
