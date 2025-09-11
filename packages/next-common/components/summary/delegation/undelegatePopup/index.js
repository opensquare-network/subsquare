import React from "react";
import { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function UndelegatePopup({ trackId, onClose, onInBlock }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.undelegate(trackId);
  }, [api, trackId]);

  return (
    <SimpleTxPopup
      title="Undelegate"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
      noSwitchSigner
    />
  );
}
