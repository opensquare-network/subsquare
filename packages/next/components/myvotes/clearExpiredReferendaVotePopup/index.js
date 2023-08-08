import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";

function ExtraInfo({ relatedReferenda, relatedTracks }) {
  return (
    <>
      <RelatedReferenda relatedReferenda={relatedReferenda} />
      <div>
        <PopupLabel text="Unlock tracks" />
        <div className="text-[12px] font-medium text-textPrimary py-[12px] border-b border-b-neutral300">
          {relatedTracks.length ? (
            relatedTracks.map((trackId) => `#${trackId}`).join(", ")
          ) : (
            <span className="text-textTertiary">None</span>
          )}
        </div>
      </div>
    </>
  );
}

export default function ClearExpiredReferendaVotePopup({
  votes,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

  const relatedTracks = Array.from(
    new Set((votes || []).map(({ trackId }) => trackId)),
  );
  relatedTracks.sort((a, b) => a - b);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doClearExpiredVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      if (!votes?.length) {
        return showErrorToast("No votes selected");
      }

      const signerAddress = signerAccount.address;
      const realAddress = signerAccount.proxyAddress || signerAddress;

      let tx;

      const txsRemoveVote = votes.map(({ trackId, referendumIndex }) =>
        api.tx.convictionVoting.removeVote(trackId, referendumIndex),
      );
      const txsUnlock = relatedTracks.map((trackId) =>
        api.tx.convictionVoting.unlock(trackId, realAddress),
      );
      tx = api.tx.utility.batch([...txsRemoveVote, ...txsUnlock]);

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
    },
    [
      dispatch,
      isMounted,
      showErrorToast,
      onInBlock,
      onSubmitted,
      onClose,
      votes,
      setIsLoading,
      relatedTracks,
    ],
  );

  return (
    <SignerPopup
      title="Clear Expired Votes"
      actionCallback={doClearExpiredVote}
      onClose={onClose}
      isLoading={isLoading}
      extraContent={
        <ExtraInfo
          relatedReferenda={relatedReferenda}
          relatedTracks={relatedTracks}
        />
      }
    />
  );
}
