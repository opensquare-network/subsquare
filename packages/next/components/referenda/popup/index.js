import { useState } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";
import { useAddressVotingBalance, useAddressVote } from "utils/hooks";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import { getNode } from "utils";
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
import { emptyFunction } from "next-common/utils";

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

  const [isLoading, setIsLoading] = useState();
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
    if (isLoading || referendumIndex == null || !node) {
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

    if (bnVoteBalance.gt(votingBalance)) {
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
        .vote(referendumIndex, {
          Standard: {
            balance: bnVoteBalance.toFixed(),
            vote: {
              aye,
              conviction: voteLock,
            },
          },
        })
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
        chain={chain}
        node={node}
        api={api}
        votingIsLoading={votingIsLoading}
        votingBalance={votingBalance}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        isLoading={isLoading}
        extensionAccounts={extensionAccounts}
      />
      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <DirectVote
          addressVoteDelegations={addressVote?.delegations}
          isLoading={isLoading}
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
        <VoteButton isLoading={isLoading} doVote={doVote} />
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
