import React, { useCallback } from "react";
import PopupLabel from "next-common/components/popup/label";
import { Input } from "../styled";
import useApi from "next-common/utils/hooks/useApi";
import isNil from "lodash.isnil";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";

function Content({ onClose, referendumIndex, pallet = "referenda" }) {
  const { component } = useSigner("Origin");
  const api = useApi();

  const getTxFunc = useCallback(() => {
    if (!api || isNil(referendumIndex)) {
      return null;
    }

    return api.tx[pallet].refundSubmissionDeposit(referendumIndex);
  }, [api, referendumIndex]);

  return (
    <>
      {component}
      <div>
        <PopupLabel text="Referendum Index" />
        <div>
          <Input disabled={true} value={referendumIndex} />
        </div>
      </div>

      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </>
  );
}

export default function SubmissionDepositRefundPopup(props) {
  return (
    <PopupWithSigner
      title="Refund submission deposit"
      Component={Content}
      {...props}
    />
  );
}
