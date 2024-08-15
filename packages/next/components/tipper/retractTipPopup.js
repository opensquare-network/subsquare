import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import SignerPopup from "next-common/components/signerPopup";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

export default function RetractTipPopup({ tipHash, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doRetractTip = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        showErrorToast("Chain network is not connected yet");
        return;
      }

      if (!signerAccount) {
        showErrorToast("Please login first");
        return;
      }

      let tx = api.tx.tips.retractTip(tipHash);
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
    },
    [dispatch, isMounted, showErrorToast, tipHash, setIsLoading, onClose],
  );

  return (
    <SignerPopup
      title="Retract Tip"
      actionCallback={doRetractTip}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
