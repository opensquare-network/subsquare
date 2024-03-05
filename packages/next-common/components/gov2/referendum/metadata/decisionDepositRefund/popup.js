import React, { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import isNil from "lodash.isnil";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";
import ReferendumIndexRow from "next-common/components/gov2/referendum/metadata/refund/referendumIndexRow";
import { useContextApi } from "next-common/context/api";

function Content({ onClose, referendumIndex, pallet = "referenda" }) {
  const { component } = useSigner("Origin");
  const api = useContextApi();

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
    <PopupWithSigner
      title="Refund decision deposit"
      Component={Content}
      {...props}
    />
  );
}
