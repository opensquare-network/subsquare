import React from "react";
import { emptyFunction } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PopupCommon from "./popupCommon";

export async function submitSubstrateExtrinsic({
  api,
  trackId,
  dispatch,
  setLoading,
  onInBlock,
  signerAccount,
  isMounted,
  onClose,
}) {
  let tx = api.tx.convictionVoting.undelegate(trackId);

  if (signerAccount?.proxyAddress) {
    tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
  }

  await sendTx({
    tx,
    dispatch,
    setLoading,
    onInBlock,
    signerAddress: signerAccount?.address,
    isMounted,
    onClose,
  });
}

export default function UndelegatePopup({
  trackId,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onInBlock = emptyFunction,
}) {
  return (
    <PopupCommon
      trackId={trackId}
      onClose={onClose}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onInBlock={onInBlock}
      submitExtrinsic={submitSubstrateExtrinsic}
    />
  );
}
