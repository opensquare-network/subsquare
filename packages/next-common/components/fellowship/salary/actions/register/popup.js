import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import useClaimantsFellowshipUpdateFunc from "next-common/hooks/fellowship/salary/useClaimantsUpdateFunc";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();
  const { section } = useCollectivesContext();

  const getTxFunc = useCallback(() => {
    if (api) {
      if (section === "fellowship") {
        return api.tx.fellowshipSalary.register();
      } else if (section === "ambassador") {
        return api.tx.ambassadorSalary.register();
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

export default function FellowshipSalaryRegisterPopup(props) {
  return (
    <PopupWithSigner title="Register" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
