import { useEffect, useState } from "react";

import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";
import { checkInputValue, isSameAddress } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import { useChainSettings } from "next-common/context/chain";
import Conviction from "next-common/components/popup/fields/convictionField";
import VoteValue from "next-common/components/democracy/delegatePopup/voteValue";
import Target from "next-common/components/democracy/delegatePopup/target";
import MultiTrack from "next-common/components/popup/fields/multiTrackField";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { normalizeAddress } from "next-common/utils/address";
import { chunk, noop } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import {
  DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  getConvictionVotingCallsPerTx,
} from "next-common/utils/convictionVotingBatch";

export default function PopupContent({ defaultTargetAddress, targetDisabled }) {
  const { tracks, showTrackSelect = true, onInBlock = noop } = usePopupParams();

  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const [targetAddress, setTargetAddress] = useState(
    normalizeAddress(defaultTargetAddress) || "",
  );

  const api = useContextApi();
  const node = useChainSettings();

  const { balance: votingBalance, isLoading: votingIsLoading } =
    useAddressVotingBalance(api, signerAccount?.realAddress);

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState(tracks);
  const signerAddress = signerAccount?.realAddress;
  const [callsPerTx, setCallsPerTx] = useState(
    DEFAULT_CONVICTION_VOTING_CALLS_PER_TX,
  );

  useEffect(() => {
    let cancelled = false;
    if (
      !api?.tx?.convictionVoting?.delegate ||
      !signerAddress ||
      !selectedTracks?.length
    ) {
      return;
    }

    getConvictionVotingCallsPerTx({
      api,
      address: signerAddress,
      sampleCall: api.tx.convictionVoting.delegate(
        selectedTracks[0],
        signerAddress,
        0,
        "0",
      ),
    }).then((size) => {
      if (!cancelled) {
        setCallsPerTx(size);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api, signerAddress, selectedTracks]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!selectedTracks || selectedTracks?.length === 0) {
        toastError("Please select at least one track");
        return;
      }

      let bnVoteBalance;
      try {
        bnVoteBalance = checkInputValue(
          inputVoteBalance,
          node.decimals,
          "vote balance",
        );
      } catch (err) {
        toastError(err.message);
        return;
      }

      if (bnVoteBalance.gt(votingBalance)) {
        toastError("Insufficient voting balance");
        return;
      }

      if (!targetAddress) {
        toastError("Please select a target address");
        return;
      }

      if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
        toastError("Target address cannot be same with the delegator address");
        return;
      }

      const calls = selectedTracks.map((trackId) =>
        api.tx.convictionVoting.delegate(
          trackId,
          targetAddress,
          conviction,
          bnVoteBalance.toString(),
        ),
      );

      const txs = chunk(calls, callsPerTx).map((txCalls) =>
        txCalls.length === 1 ? txCalls[0] : api.tx.utility.batch(txCalls),
      );

      return txs.length === 1 ? txs[0] : txs;
    },
    [
      api,
      signerAccount,
      targetAddress,
      selectedTracks,
      inputVoteBalance,
      conviction,
      callsPerTx,
    ],
  );

  const disabled = !(selectedTracks?.length > 0);
  const txCount = Math.ceil((selectedTracks?.length || 0) / callsPerTx);

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
      />

      <Target
        disabled={targetDisabled}
        extensionAccounts={extensionAccounts}
        defaultAddress={targetAddress}
        setAddress={setTargetAddress}
      />

      {showTrackSelect && (
        <MultiTrack
          selectedTracks={selectedTracks}
          setSelectedTracks={setSelectedTracks}
        />
      )}

      <VoteValue
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction
        balance={inputVoteBalance}
        conviction={conviction}
        setConviction={setConviction}
      />
      {txCount > 1 && (
        <div className="text12Medium text-textTertiary">
          The batch is too large for one transaction, so it will be split into{" "}
          {txCount} transactions. Please sign them one by one.
        </div>
      )}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <TxSubmissionButton
        getTxFunc={getTxFuncForSubmit}
        onInBlock={onInBlock}
        disabled={disabled}
      />
    </>
  );
}
