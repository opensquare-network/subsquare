import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import SignerPopup from "next-common/components/signerPopup";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

export default function RetractTipPopup({ tipHash, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doRetractTip = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      const signerAddress = signerAccount.address;

      let tx = api.tx.tips.retractTip(tipHash);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        onClose,
        signerAddress,
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
