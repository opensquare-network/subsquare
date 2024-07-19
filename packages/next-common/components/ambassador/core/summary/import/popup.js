import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import useAmbassadorMembersUpdateFunc from "next-common/components/ambassador/core/updateFunc";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx.ambassadorCore.import();
    }
  }, [api]);

  const onInBlock = useAmbassadorMembersUpdateFunc();

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

export default function AmbassadorCoreImportPopup(props) {
  return (
    <PopupWithSigner title="Import" className="!w-[640px]" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
