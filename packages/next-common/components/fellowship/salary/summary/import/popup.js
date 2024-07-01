import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();
  const { section } = useCollectivesContext();

  const getTxFunc = useCallback(() => {
    if (api) {
      if (section === "fellowship") {
        return api.tx.fellowshipSalary.induct();
      } else if (section === "ambassador") {
        return api.tx.ambassadorSalary.induct();
      }
    }
  }, [api, section]);

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

export default function FellowshipSalaryImportPopup(props) {
  return (
    <PopupWithSigner title="Induct myself" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
