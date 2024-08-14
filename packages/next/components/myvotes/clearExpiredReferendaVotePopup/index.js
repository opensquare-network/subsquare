import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
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
  votes = [],
  unlockTracks = [],
  onClose,
  onInBlock = noop,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

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

      if (!votes?.length && unlockTracks.length <= 0) {
        return showErrorToast("No unLockable balance");
      }

      const realAddress = signerAccount.proxyAddress || signerAccount.address;

      let tx;
      const txsRemoveVote = votes.map(({ trackId, referendumIndex }) =>
        api.tx.convictionVoting.removeVote(trackId, referendumIndex),
      );
      const txsUnlock = unlockTracks.map((trackId) =>
        api.tx.convictionVoting.unlock(trackId, realAddress),
      );

      const allTxs = [...txsRemoveVote, ...txsUnlock];
      if (allTxs.length === 1) {
        tx = allTxs[0];
      } else {
        tx = api.tx.utility.batch(allTxs);
      }

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
      votes,
      unlockTracks,
    ],
  );

  return (
    <SignerPopup
      title="Clear Expired Votes"
      actionCallback={doClearExpiredVote}
      onClose={onClose}
      isLoading={isLoading}
    >
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
    </SignerPopup>
  );
}
