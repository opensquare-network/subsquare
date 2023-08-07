import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import PopupLabel from "next-common/components/popup/label";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";

function ExtraInfo({ relatedReferenda, relatedTracks }) {
  const isReferenda = useIsReferenda();

  return (
    <>
      <div>
        <PopupLabel text="Related referenda" />
        <div className="text-[12px] font-medium text-textPrimary">
          {relatedReferenda.length ? (
            relatedReferenda
              .map((referendumIndex) => `#${referendumIndex}`)
              .join(", ")
          ) : (
            <span className="text-textTertiary">None</span>
          )}
        </div>
      </div>
      {isReferenda && (
        <div>
          <PopupLabel text="Unlock tracks" />
          <div className="text-[12px] font-medium text-textPrimary">
            {relatedTracks.length ? (
              relatedTracks.map((trackId) => `#${trackId}`).join(", ")
            ) : (
              <span className="text-textTertiary">None</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function ClearExpiredVotePopup({
  votes,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const isReferenda = useIsReferenda();

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

      const signerAddress = signerAccount.address;
      const realAddress = signerAccount.proxyAddress || signerAddress;

      let tx;

      if (votes?.length) {
        if (isReferenda) {
          const txsRemoveVote = votes.map(({ trackId, referendumIndex }) =>
            api.tx.convictionVoting.removeVote(trackId, referendumIndex),
          );
          const txsUnlock = relatedTracks.map((trackId) =>
            api.tx.convictionVoting.unlock(trackId, realAddress),
          );
          tx = api.tx.utility.batch([...txsRemoveVote, ...txsUnlock]);
        } else {
          const txsRemoveVote = votes.map(({ referendumIndex }) =>
            api.tx.democracy.removeVote(referendumIndex),
          );
          const txUnlock = api.tx.democracy.unlock(realAddress);
          tx = api.tx.utility.batch([...txsRemoveVote, txUnlock]);
        }
      } else {
        return showErrorToast("No votes selected");
      }

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
      isReferenda,
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
