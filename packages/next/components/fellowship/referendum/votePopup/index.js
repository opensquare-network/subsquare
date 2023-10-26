import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import PopupWithSigner from "next-common/components/popupWithSigner";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import VoteButton from "next-common/components/popup/voteButton";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import CurrentVote from "./currentVote";
import Rank from "./rank";
import VStack from "next-common/components/styled/vStack";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import VoteSuccessful from "./voteSuccessful";

function PopupContent({
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const [isVoted, setIsVoted] = useState(false);
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const signerAccount = useSignerAccount();

  const api = useApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const { vote, isLoading: isLoadingVote } = useFellowshipVote(
    referendumIndex,
    signerAccount?.realAddress,
  );

  const doVote = async (aye) => {
    if (
      loadingState !== VoteLoadingEnum.None ||
      referendumIndex == null ||
      !node
    ) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx.fellowshipCollective.vote(referendumIndex, aye);

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
      onInBlock: () => {
        setIsVoted(true);
        onInBlock();
      },
      onSubmitted,
      signerAddress,
      isMounted,
    });
  };

  if (isVoted) {
    return <VoteSuccessful vote={vote} onClose={onClose} />;
  }

  return (
    <>
      <VStack space={8}>
        <SignerWithBalance />
        <Rank />
      </VStack>
      <CurrentVote currentVote={vote} isLoadingVote={isLoadingVote} />
      <VoteButton doVote={doVote} loadingState={loadingState} />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Fellowship vote"
      Component={PopupContent}
      {...props}
    />
  );
}
