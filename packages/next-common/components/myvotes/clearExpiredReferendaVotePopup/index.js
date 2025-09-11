import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

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

function PopupContent({ votes = [], unlockTracks = [], onInBlock = noop }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;

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
    <>
      <SignerWithBalance noSwitchSigner />
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
      <TxSubmissionButton
        title="Confirm"
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </>
  );
}

export default function ClearExpiredReferendaVotePopup({
  votes = [],
  unlockTracks = [],
  onClose,
  onInBlock = noop,
}) {
  return (
    <PopupWithSigner title="Clear Expired Votes" onClose={onClose}>
      <PopupContent
        votes={votes}
        unlockTracks={unlockTracks}
        onInBlock={onInBlock}
      />
    </PopupWithSigner>
  );
}
