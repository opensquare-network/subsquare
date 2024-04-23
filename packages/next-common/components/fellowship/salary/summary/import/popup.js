import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useFellowshipClaimantsUpdateFunc from "next-common/components/fellowship/salary/hooks/useFellowshipClaimantsUpdateFunc";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx.fellowshipSalary.induct();
    }
  }, [api]);

  const onInBlock = useFellowshipClaimantsUpdateFunc(); // update fellowship salary claimants

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

export default function FellowshipSalaryImportPopup(props) {
  return (
    <PopupWithSigner title="Induct myself" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
