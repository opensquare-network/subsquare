import React, { useCallback } from "react";
import { noop } from "lodash-es";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

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
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;

  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

  const depVotes = JSON.stringify(votes);
  const depUnlockTracks = JSON.stringify(unlockTracks);

  const getTxFunc = useCallback(async () => {
    if (!votes?.length && unlockTracks.length <= 0) {
      throw new Error("No unLockable balance");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, realAddress, depVotes, depUnlockTracks]);

  return (
    <>
      <SignerWithBalance noSwitchSigner />
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
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
