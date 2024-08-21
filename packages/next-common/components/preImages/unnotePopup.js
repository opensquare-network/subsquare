import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SimpleTxPopup from "../simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function UnnotePopup({ hash, onClose, onInBlock = noop }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.preimage.unnotePreimage(hash);
  }, [api, hash]);

  return (
    <SimpleTxPopup
      title="Unnote Preimage"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
