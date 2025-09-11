import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function RetractTipPopup({ tipHash, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.tips.retractTip(tipHash);
  }, [api, tipHash]);

  return (
    <SimpleTxPopup
      title="Retract Tip"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
