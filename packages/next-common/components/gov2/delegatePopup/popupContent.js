import { useState } from "react";

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
import { noop } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";

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

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (selectedTracks?.length === 0) {
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

      let tx;
      if (selectedTracks.length === 1) {
        tx = api.tx.convictionVoting.delegate(
          selectedTracks[0],
          targetAddress,
          conviction,
          bnVoteBalance.toString(),
        );
      } else {
        tx = api.tx.utility.batch(
          selectedTracks.map((trackId) =>
            api.tx.convictionVoting.delegate(
              trackId,
              targetAddress,
              conviction,
              bnVoteBalance.toString(),
            ),
          ),
        );
      }

      return tx;
    },
    [
      api,
      signerAccount,
      targetAddress,
      selectedTracks,
      inputVoteBalance,
      conviction,
    ],
  );

  const disabled = !(selectedTracks?.length > 0);

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
      <TxSubmissionButton
        getTxFunc={getTxFuncForSubmit}
        onInBlock={onInBlock}
        disabled={disabled}
      />
      <EstimatedGas getTxFunc={getTxFuncForFee} />
    </>
  );
}
