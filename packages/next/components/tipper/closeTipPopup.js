import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function CloseTipPopup({ tipHash, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.tips.closeTip(tipHash);
  }, [api, tipHash]);

  return (
    <SimpleTxPopup title="Close Tip" getTxFunc={getTxFunc} onClose={onClose} />
  );
}
