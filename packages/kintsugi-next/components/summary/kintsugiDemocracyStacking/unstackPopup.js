import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";

export default function UndelegatePopup({
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch]
  );

  const removeDelegating = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      const signerAddress = signerAccount?.address;

      let tx = api.tx.democracy.undelegate();
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        dispatch,
        setLoading: setIsLoading,
        onInBlock,
        signerAddress,
        isMounted,
        onClose,
      });
    },
    [dispatch, onInBlock, isMounted, showErrorToast, setIsLoading, onClose]
  );

  return (
    <SignerPopup
      title="Undelegate"
      actionCallback={removeDelegating}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
