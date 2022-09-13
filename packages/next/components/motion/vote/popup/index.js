import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import PopupWithAddress from "next-common/components/popupWithAddress";
import toApiCouncil from "next-common/utils/toApiCouncil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Signer from "./signer";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { sendTx } from "next-common/utils/sendTx";
import { emptyFunction } from "next-common/utils";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import useMaybeWeb3Signer from "next-common/utils/hooks/useMaybeWeb3Signer";

function PopupContent({
  extensionAccounts,
  chain,
  votes,
  isLoadingVotes,
  voters,
  motionHash,
  motionIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  type,
}) {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);

  const selectedAddress = selectedAccount?.address;
  const selectedAccountCanVote = voters.includes(selectedAddress);
  const currentVote = votes.find((item) => item[0] === selectedAddress);

  const api = useApi(chain);
  const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
  const isMounted = useIsMounted();

  const { isKeyUser } = useMaybeWeb3Signer(api, setSelectedAccount);
  if (isKeyUser) {
    return null;
  }

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (loadingState !== VoteLoadingEnum.None) return;

    if (!voteMethod) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const tx = voteMethod(motionHash, motionIndex, approve);

    const signerAddress = selectedAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading: (loading) => {
        if (loading) {
          setLoadingState(approve ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
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
        chain={chain}
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        selectedAccountCanVote={selectedAccountCanVote}
      />
      <CurrentVote currentVote={currentVote} isLoadingVotes={isLoadingVotes} />
      <VoteButton doVote={doVote} loadingState={loadingState} />
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Vote" Component={PopupContent} {...props} />;
}
