import React, { useState } from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";

export default function UnnotePopup({ hash, onClose, onInBlock = noop }) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doUnnote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        showErrorToast("Chain network is not connected yet");
        return;
      }

      if (!signerAccount) {
        showErrorToast("Please login first");
        return;
      }

      let tx = api.tx.preimage.unnotePreimage(hash);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        onInBlock,
        onClose,
        signerAccount,
        isMounted,
      });
    },
    [
      dispatch,
      isMounted,
      showErrorToast,
      onInBlock,
      onClose,
      hash,
      setIsLoading,
    ],
  );

  return (
    <SignerPopup
      title="Unnote Preimage"
      actionCallback={doUnnote}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
