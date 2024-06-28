import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import useAddressInput from "next-common/components/collectives/core/useAddressInput";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useAmbassadorMembersUpdateFunc from "next-common/components/ambassador/core/updateFunc";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const { address: whoAddress, component: whoInput } = useAddressInput("Who");

  const getTxFunc = useCallback(() => {
    if (api && whoAddress) {
      return api.tx.ambassadorCore.induct(whoAddress);
    }
  }, [api, whoAddress]);

  const onInBlock = useAmbassadorMembersUpdateFunc();

  return (
    <>
      {component}
      {whoInput}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </>
  );
}

export default function AmbassadorCoreInductionPopup(props) {
  return (
    <PopupWithSigner title="Induct" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
