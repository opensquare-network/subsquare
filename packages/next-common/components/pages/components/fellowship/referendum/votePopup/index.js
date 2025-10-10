import { useCallback, useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { VoteEnum } from "next-common/utils/voteEnum";
import VoteButton from "next-common/components/popup/voteButton";
import useFellowshipVote from "next-common/utils/hooks/fellowship/useFellowshipVote";
import CurrentVote from "./currentVote";
import VStack from "next-common/components/styled/vStack";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { getFellowshipVote } from "next-common/utils/gov2/getFellowshipVote";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { isNil } from "lodash-es";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function PopupContent() {
  const { referendumIndex, onClose, onInBlock } = usePopupParams();
  const showVoteSuccessful = useShowVoteSuccessful();
  const signerAccount = useSignerAccount();
  const api = useConditionalContextApi();

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

  const myOnInBlock = useCallback(() => {
    getMyVoteAndShowSuccessful();
    onInBlock?.();
  }, [getMyVoteAndShowSuccessful, onInBlock]);

  const getTxFunc = useCallback(
    async (aye) => {
      if (isNil(referendumIndex)) {
        return;
      }
      return api.tx[collectivePallet].vote(referendumIndex, aye);
    },
    [api, referendumIndex, collectivePallet],
  );

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock: myOnInBlock,
    onSubmitted: onClose,
  });

  const doVote = useCallback(
    async (aye) => {
      setLoadingState(aye ? VoteEnum.Aye : VoteEnum.Nay);
      await doSubmit(aye);
    },
    [doSubmit],
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
