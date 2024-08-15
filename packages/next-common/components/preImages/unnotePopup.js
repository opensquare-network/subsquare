import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SignerPopupV2 from "../signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function UnnotePopup({ hash, onClose, onInBlock = noop }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.preimage.unnotePreimage(hash);
  }, [api, hash]);

  return (
    <SignerPopupV2
      title="Unnote Preimage"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
