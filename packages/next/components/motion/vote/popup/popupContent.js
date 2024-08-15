import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import toApiCouncil from "next-common/utils/toApiCouncil";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { noop } from "lodash-es";
import { VoteEnum } from "next-common/utils/voteEnum";
import { useChain } from "next-common/context/chain";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useShowVoteSuccessful } from "next-common/components/vote";
import Loading from "next-common/components/loading";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import { wrapWithProxy } from "next-common/utils/sendTx";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function PopupContent() {
  const {
    votes,
    refVotes,
    isLoadingVotes,
    motionHash,
    motionIndex,
    onClose,
    onInBlock = noop,
    type,
  } = usePopupParams();
  const chain = useChain();
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const showVoteSuccessful = useShowVoteSuccessful();
  const { sendTx, isLoading: isSubmitting } = useSendTransaction();

  const [loadingState, setLoadingState] = useState();

  const { isMember: canVote, loading: isMemberLoading } = useIsCollectiveMember(
    toApiCouncil(chain, type),
  );
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

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (isSubmitting) return;

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!signerAccount) {
      showErrorToast("Please select an account");
      return;
    }

    const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
    if (!voteMethod) {
      showErrorToast("Chain network is not connected yet");
      return;
    }

    let tx = voteMethod(motionHash, motionIndex, approve);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    setLoadingState(approve ? VoteEnum.Aye : VoteEnum.Nay);
    await sendTx({
      api,
      tx,
      onInBlock: () => {
        getMyVoteAndShowSuccessful();
        onInBlock();
      },
      onSubmitted: onClose,
    });
  };

  return (
    <>
      <SignerWrapper>
        <SignerWithBalance />
        {isMemberLoading ? (
          <WarningMessage className="justify-center">
            <div className="h-[19.6px]">
              <Loading size={14} />
            </div>
          </WarningMessage>
        ) : (
          <WarningMessage danger={!canVote}>
            Only council members can vote.
          </WarningMessage>
        )}
      </SignerWrapper>
      <CurrentVote currentVote={currentVote} isLoadingVotes={isLoadingVotes} />
      <VoteButton
        disabled={isMemberLoading || !canVote}
        doVote={doVote}
        loadingState={loadingState}
        isLoading={isSubmitting}
      />
    </>
  );
}
