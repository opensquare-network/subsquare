import React from "react";
import { emptyFunction } from "next-common/utils";
import PopupCommon from "./popupCommon";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { submitSubstrateExtrinsic } from ".";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeUnDelegateData } from "next-common/utils/moonPrecompiles/convictionVoting";

async function submitMoonMetamaskExtrinsic({
  trackId,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = encodeUnDelegateData({ trackId });

  if (signerAccount?.proxyAddress) {
    ({ callTo, callData } = encodeProxyData({
      real: signerAccount?.proxyAddress,
      callTo,
      callData,
    }));
  }

  await sendEvmTx({
    to: callTo,
    data: callData,
    dispatch,
    setLoading,
    onInBlock,
    onClose,
    signerAccount,
    isMounted,
  });
}

async function submitExtrinsic({
  api,
  trackId,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      trackId,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  } else {
    await submitSubstrateExtrinsic({
      api,
      trackId,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonUndelegatePopup({
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
      submitExtrinsic={submitExtrinsic}
    />
  );
}
