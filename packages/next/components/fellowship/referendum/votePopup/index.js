import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { VoteEnum } from "next-common/utils/voteEnum";
import { useChainSettings } from "next-common/context/chain";
import VoteButton from "next-common/components/popup/voteButton";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";
import { wrapWithProxy } from "next-common/utils/sendTransaction";
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
import { isNil, noop } from "lodash-es";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";

function PopupContent() {
  const { referendumIndex, onClose, onInBlock = noop } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const dispatch = useDispatch();

  const { sendTxFunc, isSubmitting } = useSendTransaction();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const signerAccount = useSignerAccount();

  const api = useContextApi();
  const node = useChainSettings();

  const [loadingState, setLoadingState] = useState();
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

  const doVote = useCallback(
    async (aye) => {
      if (isSubmitting || isNil(referendumIndex) || !node) {
        return;
      }

      if (!signerAccount) {
        showErrorToast("Please select an account");
        return;
      }

      if (!api) {
        showErrorToast("Chain network is not connected yet");
        return;
      }

      let tx = api.tx[collectivePallet].vote(referendumIndex, aye);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      setLoadingState(aye ? VoteEnum.Aye : VoteEnum.Nay);
      await sendTxFunc({
        api,
        tx,
        onInBlock: () => {
          getMyVoteAndShowSuccessful();
          onInBlock();
        },
        onSubmitted: onClose,
      });
    },
    [
      api,
      collectivePallet,
      referendumIndex,
      signerAccount,
      sendTxFunc,
      onInBlock,
      getMyVoteAndShowSuccessful,
      onClose,
      isSubmitting,
      showErrorToast,
      node,
    ],
  );

  return (
    <>
      <VStack space={8}>
        <SignerWithBalance />
      </VStack>
      <CurrentVote currentVote={vote} isLoadingVote={isLoadingVote} />
      <VoteButton
        doVote={doVote}
        isLoading={isSubmitting}
        loadingState={loadingState}
      />
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
