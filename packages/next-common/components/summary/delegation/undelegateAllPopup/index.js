import React from "react";
import { noop } from "lodash-es";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PopupCommon from "./popupCommon";

export async function submitSubstrateExtrinsic({
  api,
  trackIds,
  dispatch,
  setLoading,
  onInBlock,
  signerAccount,
  isMounted,
  onClose,
}) {
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

  if (signerAccount?.proxyAddress) {
    tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
  }

  await sendTx({
    tx,
    dispatch,
    setLoading,
    onInBlock,
    signerAccount,
    isMounted,
    onClose,
  });
}

export default function UndelegateAllPopup({
  trackIds,
  onClose,
  isLoading,
  setIsLoading = noop,
  onInBlock = noop,
}) {
  return (
    <PopupCommon
      trackIds={trackIds}
      onClose={onClose}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onInBlock={onInBlock}
      submitExtrinsic={submitSubstrateExtrinsic}
    />
  );
}
