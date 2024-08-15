import React from "react";
import { noop } from "lodash-es";
import { useCallback } from "react";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function UndelegateAllPopup({
  trackIds,
  onClose,
  onInBlock = noop,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    if (!trackIds || trackIds.length === 0) {
      return;
    }

    const txs = trackIds.map((trackId) =>
      api.tx.convictionVoting.undelegate(trackId),
    );

    let tx;
    if (txs.length === 1) {
      tx = txs[0];
    } else {
      tx = api.tx.utility.batch(txs);
    }

    return tx;
  }, [api, trackIds]);

  return (
    <SignerPopupV2
      title="Undelegate All"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
