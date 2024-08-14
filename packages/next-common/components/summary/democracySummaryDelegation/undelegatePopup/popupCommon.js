import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
import SignerPopup from "next-common/components/signerPopup";

export default function PopupCommon({
  onClose,
  isLoading,
  setIsLoading = noop,
  onInBlock = noop,
  submitExtrinsic = noop,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const removeDelegating = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      await submitExtrinsic({
        api,
        dispatch,
        setLoading: setIsLoading,
        onInBlock,
        signerAccount,
        isMounted,
        onClose,
      });
    },
    [
      dispatch,
      onInBlock,
      isMounted,
      showErrorToast,
      setIsLoading,
      onClose,
      submitExtrinsic,
    ],
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
