import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useCoreFellowshipUpdateFunc from "next-common/components/collectives/core/updateFunc";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
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

  const onInBlock = useCoreFellowshipUpdateFunc();

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
    <PopupWithSigner title="Import" className="!w-[640px]" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
