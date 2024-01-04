import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";

export default function RemoveReferendaVotePopup({
  trackId,
  referendumIndex,
  onClose,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
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

      const signerAddress = signerAccount.address;

      let tx;

      tx = api.tx.convictionVoting.removeVote(trackId, referendumIndex);

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
    [dispatch, isMounted, showErrorToast, onClose, trackId, referendumIndex],
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
