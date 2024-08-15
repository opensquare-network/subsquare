import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import toApiCouncil from "next-common/utils/toApiCouncil";

export default function CloseMotionPopup({
  chain,
  type,
  hash,
  motionIndex,
  weight,
  encodedCallLength,
  hasFailed,
  onClose,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doClose = async (api, signerAccount) => {
    if (!api) {
      showErrorToast("Chain network is not connected yet");
      return;
    }

    const closeMethod = api?.tx?.[toApiCouncil(chain, type)]?.close;
    if (!closeMethod) {
      showErrorToast("Close method is not support");
      return;
    }

    if (!signerAccount) {
      showErrorToast("Please login first");
      return;
    }

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
      onClose,
      signerAccount,
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
