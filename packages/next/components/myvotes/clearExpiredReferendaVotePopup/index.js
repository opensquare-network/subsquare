import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

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
  const api = useContextApi();
  const realAddress = useRealAddress();

  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

  const getTxFunc = useCallback(async () => {
    if (!votes?.length && unlockTracks.length <= 0) {
      dispatch(newErrorToast("No unLockable balance"));
      return;
    }

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

    return tx;
  }, [api, realAddress, dispatch, votes, unlockTracks]);

  return (
    <SimpleTxPopup
      title="Clear Expired Votes"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    >
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
    </SimpleTxPopup>
  );
}
