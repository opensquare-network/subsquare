import { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import PopupWithAddress from "next-common/components/popupWithAddress";
import toApiCouncil from "next-common/utils/toApiCouncil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import CurrentVote from "./currentVote";
import VoteButton from "next-common/components/popup/voteButton";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { emptyFunction } from "next-common/utils";
import { VoteLoadingEnum } from "next-common/utils/voteEnum";
import { useChain } from "next-common/context/chain";
import Signer from "next-common/components/popup/fields/signerField";
import { WarningMessage } from "next-common/components/popup/styled";
import styled from "styled-components";
import useSignerAccount from "next-common/utils/hooks/useSignerAccount";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

function PopupContent({
  extensionAccounts,
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
  const chain = useChain();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount(extensionAccounts);

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);

  const canVote = voters.includes(signerAccount?.realAddress);
  const currentVote = votes.find(
    (item) => item[0] === signerAccount?.realAddress
  );

  const api = useApi();
  const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (loadingState !== VoteLoadingEnum.None) return;

    if (!voteMethod) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    let tx = voteMethod(motionHash, motionIndex, approve);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    const signerAddress = signerAccount.address;

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
      <SignerWrapper>
        <Signer signerAccount={signerAccount} />
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

export default function Popup(props) {
  return <PopupWithAddress title="Vote" Component={PopupContent} {...props} />;
}
