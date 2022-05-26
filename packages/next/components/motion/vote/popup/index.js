import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import PopupWithAddress from "next-common/components/popupWithAddress";
import toApiCouncil from "next-common/utils/toApiCouncil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Signer from "./signer";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";

function PopupContent({
  extensionAccounts,
  chain,
  votes,
  isLoadingVotes,
  voters,
  motionHash,
  motionIndex,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
  type,
}) {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState();

  const selectedAddress = selectedAccount?.address;
  const selectedAccountCanVote = voters.includes(selectedAddress);
  const currentVote = votes.find((item) => item[0] === selectedAddress);

  const api = useApi(chain);
  const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (isLoading) return;

    if (!voteMethod) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setIsLoading(approve ? "Aye" : "Nay");

      const voterAddress = selectedAccount.address;

      const unsub = await voteMethod(
        motionHash,
        motionIndex,
        approve
      ).signAndSend(voterAddress, ({ events = [], status }) => {
        if (status.isFinalized) {
          onFinalized(voterAddress);
          unsub();
        }
        if (status.isInBlock) {
          // Transaction went through
          dispatch(removeToast(toastId));
          dispatch(newSuccessToast("InBlock"));
          onInBlock(voterAddress);
        }
      });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(voterAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      dispatch(newErrorToast(e.message));
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
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        selectedAccountCanVote={selectedAccountCanVote}
      />
      <CurrentVote currentVote={currentVote} isLoadingVotes={isLoadingVotes} />
      <VoteButton doVote={doVote} isLoading={isLoading} />
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Vote" Component={PopupContent} {...props} />;
}
