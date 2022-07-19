import { useState } from "react";
import { useDispatch } from "react-redux";

import isNil from "lodash.isnil";
import { useAddressVotingBalance, useAddressVote } from "utils/hooks";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import { getNode } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import Signer from "./signer";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";
import { sendTx } from "next-common/utils/sendTx";

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
  const [selectedAccount, setSelectedAccount] = useState(null);
  const node = getNode(chain);
  const [isLoading, setIsLoading] = useState();
  const api = useApi(chain);
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    api,
    selectedAccount?.address
  );
  const [addressVote, addressVoteIsLoading] = useAddressVote(
    api,
    referendumIndex,
    selectedAccount?.address
  );
  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (aye) => {
    if (isLoading || isNil(referendumIndex) || !node) {
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
      aye,
      balance: bnVoteBalance.toNumber(),
    });

    const signerAddress = selectedAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: (loading) => {
        if (loading) {
          setIsLoading(aye ? "Aye" : "Nay");
        } else {
          setIsLoading(null);
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
        chain={chain}
        isLoading={isLoading}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        votingIsLoading={votingIsLoading}
        setInputVoteBalance={setInputVoteBalance}
        votingBalance={votingBalance}
        symbol={node.voteSymbol ?? node.symbol}
      />
      <VoteBalance
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <VotingStatus
        addressVoteIsLoading={addressVoteIsLoading}
        addressVote={addressVote}
        node={node}
      />
      <VoteButton isLoading={isLoading} doVote={doVote} />
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
