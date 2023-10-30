import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import toApiCouncil from "next-common/utils/toApiCouncil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { emptyFunction } from "next-common/utils";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChain } from "next-common/context/chain";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function PopupContent({
  votes,
  refVotes,
  isLoadingVotes,
  motionHash,
  motionIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  type,
  submitExtrinsic = emptyFunction,
}) {
  const chain = useChain();
  const dispatch = useDispatch();
  const api = useApi();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);

  const canVote = useIsCollectiveMember(toApiCouncil(chain, type));
  const currentVote = votes.find(
    (item) => item[0] === signerAccount?.realAddress,
  );

  const getMyVoteAndShowSuccessful = useCallback(async () => {
    const votes = refVotes?.current;
    if (!votes) {
      return;
    }
    const currentVote = votes.find(
      (item) => item[0] === signerAccount?.realAddress,
    );
    if (!currentVote) {
      return;
    }
    showVoteSuccessful(currentVote);
  }, [refVotes, signerAccount?.realAddress, showVoteSuccessful]);

  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (loadingState !== VoteLoadingEnum.None) return;

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    const setLoading = (loading) => {
      if (loading) {
        setLoadingState(approve ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
      } else {
        setLoadingState(VoteLoadingEnum.None);
      }
    };

    await submitExtrinsic({
      api,
      chain,
      type,
      motionHash,
      motionIndex,
      approve,
      dispatch,
      setLoading,
      onFinalized,
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
      <SignerWrapper>
        <SignerWithBalance />
        {!canVote && (
          <WarningMessage danger={!canVote}>
            Only council members can vote.
          </WarningMessage>
        )}
      </SignerWrapper>
      <CurrentVote currentVote={currentVote} isLoadingVotes={isLoadingVotes} />
      <VoteButton doVote={doVote} loadingState={loadingState} />
    </>
  );
}
