import React from "react";
import { noop } from "lodash-es";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PopupCommon from "./popupCommon";

export async function submitSubstrateExtrinsic({
  api,
  dispatch,
  setLoading,
  onInBlock,
  signerAccount,
  isMounted,
  onClose,
}) {
  let tx = api.tx.democracy.undelegate();

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

export default function UndelegatePopup({
  onClose,
  isLoading,
  setIsLoading = noop,
  onInBlock = noop,
}) {
  return (
    <PopupCommon
      onClose={onClose}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onInBlock={onInBlock}
      submitExtrinsic={submitSubstrateExtrinsic}
    />
  );
}
