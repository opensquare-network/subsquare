import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import PopupWithSigner from "next-common/components/popupWithSigner";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import VoteButton from "next-common/components/popup/voteButton";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import CurrentVote from "./currentVote";
import VStack from "next-common/components/styled/vStack";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { getFellowshipVote } from "next-common/utils/gov2/getFellowshipVote";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { noop } from "lodash-es";

function PopupContent() {
  const {
    referendumIndex,
    onClose,
    onSubmitted = noop,
    onInBlock = noop,
  } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const signerAccount = useSignerAccount();

  const api = useContextApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);
  const { vote, isLoading: isLoadingVote } = useFellowshipVote(
    referendumIndex,
    signerAccount?.realAddress,
  );

  const collectivePallet = useRankedCollectivePallet();
  const getMyVoteAndShowSuccessful = useCallback(async () => {
    if (!signerAccount?.realAddress) {
      return null;
    }

    const addressVote = await getFellowshipVote(
      api,
      referendumIndex,
      signerAccount?.realAddress,
      collectivePallet,
    );
    if (!addressVote) {
      return;
    }
    showVoteSuccessful(addressVote);
  }, [
    api,
    referendumIndex,
    signerAccount?.realAddress,
    showVoteSuccessful,
    collectivePallet,
  ]);

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

    let tx = api.tx[collectivePallet].vote(referendumIndex, aye);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

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
        getMyVoteAndShowSuccessful();
        onInBlock();
      },
      onSubmitted,
      signerAccount,
      isMounted,
      onClose,
    });
  };

  return (
    <>
      <VStack space={8}>
        <SignerWithBalance />
      </VStack>
      <CurrentVote currentVote={vote} isLoadingVote={isLoadingVote} />
      <VoteButton doVote={doVote} loadingState={loadingState} />
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="Fellowship vote" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
