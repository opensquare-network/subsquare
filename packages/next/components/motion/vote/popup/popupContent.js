import { useState } from "react";
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
import Signer from "next-common/components/popup/fields/signerField";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function PopupContent({
  extensionAccounts,
  votes,
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
  const signerAccount = useSignerAccount(extensionAccounts);
  const [balance, loadingBalance] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, loadingSignerBalance] = useAddressBalance(
    api,
    signerAccount?.address,
  );

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);

  const canVote = useIsCollectiveMember(toApiCouncil(chain, type));
  const currentVote = votes.find(
    (item) => item[0] === signerAccount?.realAddress,
  );

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
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  };

  return (
    <>
      <SignerWrapper>
        <Signer
          signerAccount={signerAccount}
          balance={balance}
          isBalanceLoading={loadingBalance}
          signerBalance={signerBalance}
          isSignerBalanceLoading={loadingSignerBalance}
        />
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
