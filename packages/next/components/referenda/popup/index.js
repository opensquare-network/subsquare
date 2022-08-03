import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVote, useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, emptyFunction, getNode } from "next-common/utils";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import DirectVote from "./directVote";
import VoteButton from "next-common/components/popup/voteButton";
import Signer from "./signer";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx } from "next-common/utils/sendTx";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";

function PopupContent({
  extensionAccounts,
  chain,
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [selectedAccount, setSelectedAccount] = useState(null);

  const api = useApi(chain);
  const node = getNode(chain);

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    selectedAccount?.address
  );

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
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

    const tx = api.tx.democracy.vote(referendumIndex, {
      Standard: {
        balance: bnVoteBalance.toNumber(),
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
        chain={chain}
        node={node}
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
      title="Referenda vote"
      Component={PopupContent}
      {...props}
    />
  );
}
