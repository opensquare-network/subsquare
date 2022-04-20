import { useState } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";
import isNil from "lodash.isnil";
import { useAddressVotingBalance, useAddressVote } from "utils/hooks";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import { getNode } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import Signer from "./signer";
import VoteBalance from "./voteBalance";
import VotingStatus from "./votingStatus";
import VoteButton from "next-common/components/popup/voteButton";

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

    if (!inputVoteBalance) {
      return showErrorToast("Please input vote balance");
    }

    const decimals = node.decimals;
    const bnVoteBalance = new BigNumber(inputVoteBalance).multipliedBy(
      Math.pow(10, decimals)
    );

    if (bnVoteBalance.isNaN()) {
      return showErrorToast("Invalid vote balance");
    }

    if (bnVoteBalance.lte(0) || !bnVoteBalance.mod(1).isZero()) {
      return showErrorToast("Invalid vote balance");
    }

    const bnVotingBalance = new BigNumber(votingBalance).multipliedBy(
      Math.pow(10, decimals)
    );
    if (bnVoteBalance.gt(bnVotingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setIsLoading(aye ? "Aye" : "Nay");

      const voteAddress = selectedAccount.address;

      const unsub = await api.tx.democracy
        .vote(referendumIndex, { aye, balance: bnVoteBalance.toFixed() })
        .signAndSend(voteAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(voteAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(updatePendingToast(toastId, "InBlock"));
            onInBlock(voteAddress);
          }
        });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(voteAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      showErrorToast(e.message);
    } finally {
      if (isMounted.current) {
        setIsLoading(null);
      }
    }
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
      />
      <VoteBalance
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
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
