import React from "react";
import { emptyFunction } from "next-common/utils";
import PopupCommon from "./popupCommon";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { submitPolkadotExtrinsic } from ".";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeUnDelegateData } from "next-common/utils/moonPrecompiles/convictionVoting";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";

async function submitMoonMetamaskExtrinsic({
  trackIds,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = encodeUnDelegateData({ trackId: trackIds[0] });

  if (trackIds.length > 1) {
    let toParam = [],
      valueParam = [],
      callDataParam = [],
      gasLimitParam = [];

    toParam.push(callTo);
    callDataParam.push(callData);

    for (let n = 1; n < trackIds.length; n++) {
      let { callTo, callData } = encodeUnDelegateData({ trackId: trackIds[n] });

      toParam.push(callTo);
      callDataParam.push(callData);
    }

    ({ callTo, callData } = encodeBatchAllData({
      to: toParam,
      value: valueParam,
      callData: callDataParam,
      gasLimit: gasLimitParam,
    }));
  }

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
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

async function submitExtrinsic({
  api,
  trackIds,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      trackIds,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  } else {
    await submitPolkadotExtrinsic({
      api,
      trackIds,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonUndelegateAllPopup({
  trackIds,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onInBlock = emptyFunction,
}) {
  return (
    <PopupCommon
      trackIds={trackIds}
      onClose={onClose}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      onInBlock={onInBlock}
      submitExtrinsic={submitExtrinsic}
    />
  );
}
