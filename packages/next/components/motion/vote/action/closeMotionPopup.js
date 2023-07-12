import React from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { emptyFunction } from "next-common/utils";

export default function CloseMotionPopup({
  chain,
  type,
  hash,
  motionIndex,
  weight,
  encodedCallLength,
  hasFailed,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClose = async (api, signerAccount) => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    const closeMethod = api?.tx?.[toApiCouncil(chain, type)]?.close;
    if (!closeMethod) {
      return showErrorToast("Close method is not support");
    }

    if (!signerAccount) {
      return showErrorToast("Please login first");
    }

    const signerAddress = signerAccount.address;

    let tx;
    if (closeMethod.meta?.args?.length !== 4) {
      tx = closeMethod(hash, motionIndex);
    } else if (hasFailed) {
      tx = closeMethod(hash, motionIndex, 0, 0);
    } else {
      tx = closeMethod(hash, motionIndex, weight, encodedCallLength);
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      setLoading: setIsLoading,
      dispatch,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  return (
    <SignerPopup
      title="Close Motion"
      actionCallback={doClose}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
