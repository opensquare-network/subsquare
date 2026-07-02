"use client";

import { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function ApproveAttemptDialog({
  onClose,
  lostAccount,
  friendGroupIndex,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.recovery.approveAttempt(lostAccount, friendGroupIndex);
  }, [api, lostAccount, friendGroupIndex]);

  return (
    <SimpleTxPopup
      title="Approve Recovery Attempt"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
