import React from "react";
import PopupWithAddress from "next-common/components/popupWithAddress";
import PopupContent from "./popupContent";
import { emptyFunction } from "next-common/utils";
import { submitPolkadotExtrinsic } from ".";
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
    signerAddress: signerAccount?.address,
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
    await submitPolkadotExtrinsic({
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
    <PopupWithAddress
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
