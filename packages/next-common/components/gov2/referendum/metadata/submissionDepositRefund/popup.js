import React, { useCallback } from "react";
import { isNil } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";
import ReferendumIndexRow from "next-common/components/gov2/referendum/metadata/refund/referendumIndexRow";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

function Content() {
  const { onClose, referendumIndex, pallet = "referenda" } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (!api || isNil(referendumIndex)) {
      return null;
    }

    return api.tx[pallet].refundSubmissionDeposit(referendumIndex);
  }, [api, pallet, referendumIndex]);

  return (
    <>
      {component}
      <ReferendumIndexRow referendumIndex={referendumIndex} />
      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function SubmissionDepositRefundPopup(props) {
  return (
    <PopupWithSigner title="Refund submission deposit" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
