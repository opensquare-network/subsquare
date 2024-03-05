import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useFellowshipMembersUpdateFunc from "next-common/components/fellowship/core/updateFunc";
import { usePopupParams } from "next-common/components/popup/wrapper/context";
import { useContextApi } from "next-common/context/api";

function Content() {
  const { onClose } = usePopupParams();
  const { component } = useSigner();
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (api) {
      return api.tx.fellowshipCore.import();
    }
  }, [api]);

  const onInBlock = useFellowshipMembersUpdateFunc();

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

export default function FellowshipCoreImportPopup(props) {
  return (
    <PopupWithSigner title="Import" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
