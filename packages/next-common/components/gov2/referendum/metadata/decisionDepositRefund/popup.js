import React, { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import useApi from "next-common/utils/hooks/useApi";
import isNil from "lodash.isnil";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";
import ReferendumIndexRow from "next-common/components/gov2/referendum/metadata/refund/referendumIndexRow";
import { usePopupParams } from "next-common/components/popup/wrapper/context";

function Content() {
  const { onClose, referendumIndex, pallet = "referenda" } = usePopupParams();
  const { component } = useSigner("Origin");
  const api = useApi();

  const getTxFunc = useCallback(() => {
    if (!api || isNil(referendumIndex)) {
      return null;
    }

    return api.tx[pallet].refundDecisionDeposit(referendumIndex);
  }, [api, referendumIndex]);

  return (
    <>
      {component}
      <ReferendumIndexRow referendumIndex={referendumIndex} />
      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function DecisionDepositRefundPopup(props) {
  return (
    <PopupWithSigner title="Refund decision deposit" {...props}>
      <Content />
    </PopupWithSigner>
  );
}
