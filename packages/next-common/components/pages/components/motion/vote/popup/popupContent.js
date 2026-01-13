import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { VoteEnum } from "next-common/utils/voteEnum";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { useContextApi } from "next-common/context/api";
import useCollectiveMotionVotes from "next-common/hooks/collective/useCollectiveVotes";
import { useCollectivePallet } from "next-common/context/collective";
import { isSameAddress, isMotionEnded } from "next-common/utils";
import { useOnchainData } from "next-common/context/post";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function PopupContent() {
  const onchainData = useOnchainData();
  const motionEnd = isMotionEnded(onchainData);
  const indexer = motionEnd ? onchainData?.state?.indexer : null;

  return (
    <MigrationConditionalApiProvider indexer={indexer}>
      <PopupContentWithContext />
    </MigrationConditionalApiProvider>
  );
}

function PopupContentWithContext() {
  const { motionHash, motionIndex, onClose } = usePopupParams();
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();

  const votes = useCollectiveMotionVotes();

  const [loadingState, setLoadingState] = useState();

  const pallet = useCollectivePallet();
  const { isMember: canVote, loading: isMemberLoading } =
    useIsCollectiveMember();
  const currentVote = votes.find((item) =>
    isSameAddress(item[0], signerAccount?.realAddress),
  );

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    if (!votes) {
      return;
    }

    const currentVote = votes.find((item) =>
      isSameAddress(item[0], signerAccount?.realAddress),
    );
    if (currentVote) {
      showVoteSuccessful(currentVote);
    }
  }, [votes, signerAccount?.realAddress, showVoteSuccessful]);

  const onInBlock = useCallback(() => {
    getMyVoteAndShowSuccessful();
  }, [getMyVoteAndShowSuccessful]);

  const getTxFunc = useCallback(
    async (approve) => {
      if (!motionHash || motionIndex === undefined) {
        return;
      }

      if (!api.tx[pallet]?.vote) {
        dispatch(newErrorToast(`${pallet}.vote is not supported`));
        return;
      }

      return api.tx[pallet].vote(motionHash, motionIndex, approve);
    },
    [api, motionHash, motionIndex, pallet, dispatch],
  );

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onSubmitted: onClose,
  });

  const doVote = useCallback(
    async (approve) => {
      setLoadingState(approve ? VoteEnum.Aye : VoteEnum.Nay);
      await doSubmit(approve);
    },
    [doSubmit],
  );

  return (
    <>
      <SignerWrapper>
        <SignerWithBalance />
        {!isMemberLoading && !canVote && (
          <WarningMessage danger={true}>
            Only council members can vote.
          </WarningMessage>
        )}
      </SignerWrapper>
      <CurrentVote currentVote={currentVote} />
      <VoteButton
        disabled={isMemberLoading || !canVote}
        doVote={doVote}
        loadingState={loadingState}
        isLoading={isSubmitting}
      />
    </>
  );
}
