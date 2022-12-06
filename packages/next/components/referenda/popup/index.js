import { useState } from "react";
import { useDispatch } from "react-redux";

import { useAddressVote, useAddressVotingBalance } from "utils/hooks";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue, emptyFunction } from "next-common/utils";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import DirectVote from "./directVote";
import VoteButton from "next-common/components/popup/voteButton";
import Signer from "next-common/components/popup/fields/signerField";

import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";

function PopupContent({
  extensionAccounts,
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const signerAccount = useSignerAccount(extensionAccounts);

  const api = useApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    signerAccount?.realAddress
  );

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
    referendumIndex,
    signerAccount?.realAddress
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

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx.democracy.vote(referendumIndex, {
      Standard: {
        balance: bnVoteBalance.toString(),
        vote: {
          aye,
          conviction: voteLock,
        },
      },
    });

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    const signerAddress = signerAccount.address;

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
        isBalanceLoading={votingIsLoading}
        balance={votingBalance}
        balanceName="Voting balance"
        signerAccount={signerAccount}
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
        />
      )}

      {addressVote?.delegating && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating addressVoteDelegate={addressVote?.delegating} />
      )}

      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {addressVote?.standard && (
        <StandardVoteStatus addressVoteStandard={addressVote?.standard} />
      )}
      {addressVote?.split && (
        <SplitVoteStatus addressVoteSplit={addressVote?.split} />
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
