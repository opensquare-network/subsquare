import React, { useCallback, useEffect, useState } from "react";
import { chunk, noop } from "lodash-es";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import {
  DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  filterExistingVotes,
  getConvictionVotingCallsPerTx,
} from "next-common/utils/convictionVotingBatch";

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
  const [callsPerTx, setCallsPerTx] = useState(
    DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  );

  useEffect(() => {
    let cancelled = false;
    if (!api?.tx?.convictionVoting || !realAddress) {
      return;
    }

    const sampleCalls = [];
    if (votes?.length) {
      const { trackId, referendumIndex } = votes[0];
      sampleCalls.push(
        api.tx.convictionVoting.removeVote(trackId, referendumIndex),
      );
    }
    if (unlockTracks?.length) {
      sampleCalls.push(
        api.tx.convictionVoting.unlock(unlockTracks[0], realAddress),
      );
    }
    if (sampleCalls.length === 0) {
      return;
    }

    getConvictionVotingCallsPerTx({
      api,
      address: realAddress,
      sampleCalls,
    }).then((size) => {
      if (!cancelled) {
        setCallsPerTx(size);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, realAddress, depVotes, depUnlockTracks]);

  const getTxFunc = useCallback(async () => {
    if (!votes?.length && unlockTracks.length <= 0) {
      throw new Error("No unLockable balance");
    }

    // Skip votes that are already removed, otherwise a retry after a partially
    // sent batch fails the whole atomic batch with NotVoter.
    const votesToRemove = await filterExistingVotes(api, realAddress, votes);

    const txsRemoveVote = votesToRemove.map(({ trackId, referendumIndex }) =>
      api.tx.convictionVoting.removeVote(trackId, referendumIndex),
    );
    const txsUnlock = unlockTracks.map((trackId) =>
      api.tx.convictionVoting.unlock(trackId, realAddress),
    );

    const allTxs = [...txsRemoveVote, ...txsUnlock];
    if (allTxs.length === 0) {
      return;
    }

    const txs = chunk(allTxs, callsPerTx).map((txCalls) =>
      txCalls.length === 1 ? txCalls[0] : api.tx.utility.batch(txCalls),
    );

    return txs.length === 1 ? txs[0] : txs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, realAddress, depVotes, depUnlockTracks, callsPerTx]);

  const txCount = Math.ceil(
    ((votes?.length || 0) + (unlockTracks?.length || 0)) / callsPerTx,
  );

  return (
    <>
      <SignerWithBalance noSwitchSigner />
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
      {txCount > 1 && (
        <div className="text12Medium text-textTertiary">
          The batch is too large for one transaction, so it will be split into{" "}
          {txCount} transactions. Please sign them one by one.
        </div>
      )}
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
