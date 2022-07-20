import { useState } from "react";
import { useDispatch } from "react-redux";

import isNil from "lodash.isnil";
import { useAddressVotingBalance, useAddressVote } from "utils/hooks";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import { getNode } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { checkInputValue, emptyFunction } from "next-common/utils";
import Signer from "./signer";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";
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
  const [selectedAccount, setSelectedAccount] = useState(null);
  const node = getNode(chain);
  const [loadingButton, setLoadingButton] = useState(VoteLoadingEnum.None);
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
    if (loadingButton !== VoteLoadingEnum.None || isNil(referendumIndex) || !node) {
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
          setLoadingButton(aye ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
        } else {
          setLoadingButton(VoteLoadingEnum.None);
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
        isLoading={loadingButton !== VoteLoadingEnum.None}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        votingIsLoading={votingIsLoading}
        setInputVoteBalance={setInputVoteBalance}
        votingBalance={votingBalance}
        symbol={node.voteSymbol ?? node.symbol}
      />
      <VoteBalance
        isLoading={loadingButton !== VoteLoadingEnum.None}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <VotingStatus
        addressVoteIsLoading={addressVoteIsLoading}
        addressVote={addressVote}
        node={node}
      />
      <VoteButton loadingButton={loadingButton} doVote={doVote} />
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
