import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { noop } from "lodash-es";
import { VoteEnum } from "next-common/utils/voteEnum";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import { usePopupParams, useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import { wrapWithProxy } from "next-common/utils/sendTransaction";
import useCollectiveMotionVotes from "next-common/hooks/collective/useCollectiveVotes";
import { useCollectivePallet } from "next-common/context/collective";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function PopupContent() {
  const {
    motionHash,
    motionIndex,
    onClose,
    onInBlock = noop,
  } = usePopupParams();
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();
  const { sendTxFunc, isLoading: isSubmitting } = useSendTransaction();
  const votes = useCollectiveMotionVotes();

  const [loadingState, setLoadingState] = useState();

  const pallet = useCollectivePallet();
  const { isMember: canVote, loading: isMemberLoading } =
    useIsCollectiveMember(pallet);
  const currentVote = votes.find(
    (item) => item[0] === signerAccount?.realAddress,
  );

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    if (!votes) {
      return;
    }

    const currentVote = votes.find(
      (item) => item[0] === signerAccount?.realAddress,
    );
    if (currentVote) {
      showVoteSuccessful(currentVote);
    }
  }, [votes, signerAccount?.realAddress, showVoteSuccessful]);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doVote = useCallback(
    async (approve) => {
      if (isSubmitting) return;

      if (!motionHash || motionIndex === undefined) {
        return;
      }

      if (!signerAccount) {
        showErrorToast("Please select an account");
        return;
      }

      const voteMethod = api?.tx?.[pallet]?.vote;
      if (!voteMethod) {
        showErrorToast("Chain network is not connected yet");
        return;
      }

      let tx = voteMethod(motionHash, motionIndex, approve);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      setLoadingState(approve ? VoteEnum.Aye : VoteEnum.Nay);
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
      pallet,
      motionHash,
      motionIndex,
      signerAccount,
      sendTxFunc,
      onInBlock,
      getMyVoteAndShowSuccessful,
      onClose,
      isSubmitting,
      showErrorToast,
    ],
  );

  return (
    <>
      <SignerWrapper>
        <SignerWithBalance />
        {
          !isMemberLoading && !canVote && (
            <WarningMessage danger={true}>
              Only council members can vote.
            </WarningMessage>
          )
        }
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
