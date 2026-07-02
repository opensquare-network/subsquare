"use client";

import { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function SlashAttemptDialog({
  onClose,
  friendGroupIndex,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.recovery.slashAttempt(friendGroupIndex);
  }, [api, friendGroupIndex]);

  return (
    <SimpleTxPopup
      title={`Slash Attempt #${friendGroupIndex}`}
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
