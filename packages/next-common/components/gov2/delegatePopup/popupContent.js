import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance } from "utils/hooks";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, isSameAddress } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";

import { useChainSettings } from "next-common/context/chain";
import Conviction from "next-common/components/popup/fields/convictionField";
import VoteValue from "next-common/components/democracy/delegatePopup/voteValue";
import Target from "next-common/components/democracy/delegatePopup/target";
import PrimaryButton from "next-common/lib/button/primary";
import MultiTrack from "next-common/components/popup/fields/multiTrackField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { normalizeAddress } from "next-common/utils/address";
import { wrapWithProxy } from "next-common/utils/sendTx";
import { usePopupSendTransaction } from "next-common/hooks/usePopupSendTransaction";
import { noop } from "lodash-es";

export default function PopupContent({ defaultTargetAddress, targetDisabled }) {
  const { tracks, showTrackSelect = true, onInBlock = noop } = usePopupParams();
  const dispatch = useDispatch();

  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const [targetAddress, setTargetAddress] = useState(
    normalizeAddress(defaultTargetAddress) || "",
  );

  const api = useContextApi();
  const node = useChainSettings();

  const { sendTx, isLoading } = usePopupSendTransaction();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress,
  );

  const [signerBalance, isSignerBalanceLoading] = useAddressVotingBalance(
    api,
    signerAccount?.address,
  );

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [conviction, setConviction] = useState(0);
  const [selectedTracks, setSelectedTracks] = useState(tracks);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doDelegate = async () => {
    if (isLoading) {
      return;
    }

    if (selectedTracks.length === 0) {
      return showErrorToast("Please select at least one track");
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance",
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!targetAddress) {
      return showErrorToast("Please input a target address");
    }

    if (isSameAddress(targetAddress, signerAccount?.realAddress)) {
      return showErrorToast(
        "Target address cannot be same with the delegator address",
      );
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

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({ api, tx, onInBlock });
  };

  const disabled = !(selectedTracks?.length > 0);

  return (
    <>
      <Signer
        balanceName="Voting balance"
        balance={votingBalance}
        isBalanceLoading={votingIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
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
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <Conviction
        balance={inputVoteBalance}
        conviction={conviction}
        setConviction={setConviction}
      />
      <PopupButtonWrapper>
        <PrimaryButton
          loading={isLoading}
          disabled={disabled}
          onClick={doDelegate}
        >
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}
