import React, { useCallback } from "react";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function RetractTipPopup({ tipHash, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.tips.retractTip(tipHash);
  }, [api, tipHash]);

  return (
    <SignerPopupV2
      title="Retract Tip"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
