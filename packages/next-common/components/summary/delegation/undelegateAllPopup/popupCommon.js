import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import SignerPopup from "next-common/components/signerPopup";

export default function PopupCommon({
  trackIds,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onInBlock = emptyFunction,
  submitExtrinsic = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

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
        trackIds,
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
      trackIds,
      showErrorToast,
      setIsLoading,
      onClose,
      submitExtrinsic,
    ],
  );

  return (
    <SignerPopup
      title="Undelegate All"
      actionCallback={removeDelegating}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
