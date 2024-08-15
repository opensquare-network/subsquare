import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function UndelegatePopup({ onClose, onInBlock = noop }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.democracy.undelegate();
  }, [api]);

  return (
    <SignerPopupV2
      title="Undelegate"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
