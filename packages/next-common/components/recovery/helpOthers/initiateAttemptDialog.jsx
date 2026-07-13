"use client";

import { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function InitiateAttemptDialog({
  onClose,
  lostAccount,
  friendGroupIndex,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.recovery.initiateAttempt(lostAccount, friendGroupIndex);
  }, [api, lostAccount, friendGroupIndex]);

  return (
    <SimpleTxPopup
      title="Initiate Recovery Attempt"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
