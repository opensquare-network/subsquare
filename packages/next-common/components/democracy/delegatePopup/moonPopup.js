import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import { emptyFunction } from "next-common/utils";
import { submitSubstrateExtrinsic } from ".";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { encodeDelegateData } from "next-common/utils/moonPrecompiles/democracy";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

async function submitMoonMetamaskExtrinsic({
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = encodeDelegateData({
    targetAddress,
    conviction: parseInt(conviction),
    amount: BigInt(bnVoteBalance.toString()),
  });

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
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      conviction,
      bnVoteBalance,
      targetAddress,
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
      conviction,
      bnVoteBalance,
      targetAddress,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonDelegatePopup(props) {
  return (
    <PopupWithSigner
      title="Delegate"
      Component={PopupContent}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
