import React from "react";
import { noop } from "lodash-es";
import { useCallback } from "react";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function UndelegatePopup({
  trackId,
  onClose,
  onInBlock = noop,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.undelegate(trackId);
  }, [api, trackId]);

  return (
    <SignerPopupV2
      title="Undelegate"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
