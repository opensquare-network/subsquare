"use client";

import { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function RevokeInheritorDialog({
  onClose,
  onInBlock = () => {},
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.recovery.revokeInheritor();
  }, [api]);

  return (
    <SimpleTxPopup
      title="Revoke Inheritor"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
