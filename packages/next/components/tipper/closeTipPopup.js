import React, { useCallback } from "react";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function CloseTipPopup({ tipHash, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.tips.closeTip(tipHash);
  }, [api, tipHash]);

  return (
    <SignerPopupV2 title="Close Tip" getTxFunc={getTxFunc} onClose={onClose} />
  );
}
