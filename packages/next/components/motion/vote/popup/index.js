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
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import isMoonChain from "next-common/utils/isMoonChain";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import * as treasuryCouncil from "next-common/utils/moonPrecompiles/treasuryCouncil";
import * as moonCouncil from "next-common/utils/moonPrecompiles/council";
import * as techCommCouncil from "next-common/utils/moonPrecompiles/techCommCouncil";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import isUseMetamask from "next-common/utils/isUseMetamask";

const SignerWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

function PopupContent({
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
}) {
  const chain = useChain();
  const dispatch = useDispatch();
  const api = useApi();
  const signerAccount = useSignerAccount(extensionAccounts);
  const [balance, loadingBalance] = useAddressBalance(
    api,
    signerAccount?.realAddress
  );
  const [signerBalance, loadingSignerBalance] = useAddressBalance(
    api,
    signerAccount?.address
  );

  const [loadingState, setLoadingState] = useState(VoteLoadingEnum.None);

  const canVote = useIsCollectiveMember(toApiCouncil(chain, type));
  const currentVote = votes.find(
    (item) => item[0] === signerAccount?.realAddress
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

    const signerAddress = signerAccount.address;

    const setLoading = (loading) => {
      if (loading) {
        setLoadingState(approve ? VoteLoadingEnum.Aye : VoteLoadingEnum.Nay);
      } else {
        setLoadingState(VoteLoadingEnum.None);
      }
    };

    if (isMoonChain() && isUseMetamask()) {
      let callTo, callData;

      if (type === detailPageCategory.TREASURY_COUNCIL_MOTION) {
        ({ callTo, callData } = treasuryCouncil.encodeVoteData({
          proposalHash: motionHash,
          proposalIndex: motionIndex,
          approve,
        }));
      } else if (type === detailPageCategory.COUNCIL_MOTION) {
        ({ callTo, callData } = moonCouncil.encodeVoteData({
          proposalHash: motionHash,
          proposalIndex: motionIndex,
          approve,
        }));
      } else if (type === detailPageCategory.TECH_COMM_MOTION) {
        ({ callTo, callData } = techCommCouncil.encodeVoteData({
          proposalHash: motionHash,
          proposalIndex: motionIndex,
          approve,
        }));
      } else {
        return showErrorToast(`Unsupported vote for motion type: ${type}`);
      }

      if (signerAccount?.proxyAddress) {
        ({ callTo, callData } = encodeProxyData({
          real: signerAccount?.proxyAddress,
          callTo,
          callData,
        }));
      }

      await sendEvmTx({
        to: callTo,
        data: callData,
        dispatch,
        setLoading,
        onInBlock,
        onSubmitted,
        onClose,
        signerAddress,
        isMounted,
      });
    } else {
      const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
      if (!voteMethod) {
        return showErrorToast("Chain network is not connected yet");
      }

      let tx = voteMethod(motionHash, motionIndex, approve);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        dispatch,
        setLoading,
        onFinalized,
        onInBlock,
        onSubmitted,
        onClose,
        signerAddress,
        isMounted,
      });
    }
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

export default function Popup(props) {
  return <PopupWithAddress title="Vote" Component={PopupContent} {...props} />;
}
