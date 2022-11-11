import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVotingBalance, useGov2AddressVote } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, emptyFunction } from "next-common/utils";
import StandardVoteStatus from "components/referenda/popup/standardVoteStatus";
import SplitVoteStatus from "components/referenda/popup/splitVoteStatus";
import DelegateVoteStatus from "components/referenda/popup/delegateVoteStatus";
import NoVoteRecord from "components/referenda/popup/noVoteRecord";
import LoadingVoteStatus from "components/referenda/popup/loadingVoteStatus";
import Delegating from "components/referenda/popup/delegating";
import DirectVote from "components/referenda/popup/directVote";
import VoteButton from "next-common/components/popup/voteButton";
import Signer from "components/referenda/popup/signer";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx } from "next-common/utils/sendTx";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";

function PopupContent({
  extensionAccounts,
  referendumIndex,
  trackId,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [selectedAccount, setSelectedAccount] = useState(null);

  const api = useApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    selectedAccount?.address
  );

  const [addressVote, addressVoteIsLoading] = useGov2AddressVote(
    api,
    trackId,
    referendumIndex,
    selectedAccount?.address
  );

  const addressVoteDelegateVoted = addressVote?.delegating?.voted;

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [voteLock, setVoteLock] = useState(0);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (aye) => {
    if (
      loadingState !== VoteLoadingEnum.None ||
      referendumIndex == null ||
      !node
    ) {
      return;
    }

    if (!node) {
      return;
    }

    let bnVoteBalance;
    try {
      bnVoteBalance = checkInputValue(
        inputVoteBalance,
        node.decimals,
        "vote balance"
      );
    } catch (err) {
      return showErrorToast(err.message);
    }

    if (bnVoteBalance.gt(votingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    const tx = api.tx.convictionVoting.vote(referendumIndex, {
      Standard: {
        balance: bnVoteBalance.toString(),
        vote: {
          aye,
          conviction: voteLock,
        },
      },
    });

    const signerAddress = selectedAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: (loading) => {
        if (loading) {
          setLoadingState(aye ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
        } else {
          setLoadingState(VoteLoadingEnum.None);
        }
      },
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  };

  return (
    <>
      <Signer
        api={api}
        votingIsLoading={votingIsLoading}
        votingBalance={votingBalance}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        isLoading={loadingState !== VoteLoadingEnum.None}
        extensionAccounts={extensionAccounts}
      />
      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <DirectVote
          addressVoteDelegations={addressVote?.delegations}
          isLoading={loadingState !== VoteLoadingEnum.None}
          inputVoteBalance={inputVoteBalance}
          setInputVoteBalance={setInputVoteBalance}
          voteLock={voteLock}
          setVoteLock={setVoteLock}
          node={node}
        />
      )}

      {addressVote?.delegating && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating addressVoteDelegate={addressVote?.delegating} node={node} />
      )}

      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {addressVote?.standard && (
        <StandardVoteStatus
          addressVoteStandard={addressVote?.standard}
          node={node}
        />
      )}
      {addressVote?.split && (
        <SplitVoteStatus addressVoteSplit={addressVote?.split} node={node} />
      )}
      {addressVote?.delegating && addressVoteDelegateVoted && (
        <DelegateVoteStatus addressVoteDelegate={addressVote?.delegating} />
      )}
      {addressVoteIsLoading && <LoadingVoteStatus />}

      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <VoteButton loadingState={loadingState} doVote={doVote} />
      )}
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Referendum vote"
      Component={PopupContent}
      {...props}
    />
  );
}
