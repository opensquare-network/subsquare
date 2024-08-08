import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { isNil } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

function Content() {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const { index } = useOnchainData() || {};
  const { onClose } = usePopupParams();

  const getTxFunc = useCallback(() => {
    if (api && !isNil(index)) {
      return api.tx.treasury.payout(index);
    }
  }, [api, index]);

  return (
    <>
      {component}
      <TxSubmissionButton
        title="Pay"
        getTxFunc={getTxFunc}
        onClose={onClose}
      />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Payout" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
