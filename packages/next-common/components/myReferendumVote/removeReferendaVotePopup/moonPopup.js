import React, { useState } from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import SignerPopup from "next-common/components/signerPopup";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { encodeRemoveVoteForTrackData } from "next-common/utils/moonPrecompiles/convictionVoting";

export default function MoonRemoveReferendaVotePopup({
  trackId,
  referendumIndex,
  onClose,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doRemoveVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      let { callTo, callData } = encodeRemoveVoteForTrackData({
        trackId,
        pollIndex: referendumIndex,
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
        setLoading: setIsLoading,
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
      trackId,
      referendumIndex,
    ],
  );

  return (
    <SignerPopup
      title="Remove Vote"
      actionCallback={doRemoveVote}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
