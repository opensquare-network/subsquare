import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function UndelegatePopup({ onClose, onInBlock = noop }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.democracy.undelegate();
  }, [api]);

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
