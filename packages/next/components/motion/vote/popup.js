import styled, { css } from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useApi } from "utils/hooks";
import Button from "next-common/components/button";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import Loading from "./loading";
import SignerSelect from "next-common/components/signerSelect";
import PopupWithAddress from "next-common/components/popupWithAddress";
import toApiCouncil from "../toApiCouncil";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

const Info = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  color: #506176;
  font-size: 14px;
  line-height: 140%;
  margin-top: 8px;
  ${(p) =>
    p.danger &&
    css`
      color: #f44336;
      background: #fff1f0;
    `}
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 12px 16px;
  background: #f6f7fa;
  border-radius: 4px;
  color: rgba(80, 97, 118, 1);
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
`;

const CurrentVotingWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const CurrentVoting = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #1e2134;
  > :last-child {
    font-size: 12px;
    line-height: 100%;
    color: #506176;
    display: flex;
    align-items: center;
    > img {
      margin-left: 8px;
    }
  }
`;

const CurrentVotingNoData = styled(Message)`
  color: #9da9bb;
  display: block;
  text-align: center;
`;

const CurrentVotingLoading = styled.div`
  height: 38px;
  background: #f6f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  > first-child {
    background: #4caf50;
  }
  > * {
    flex-grow: 1;
  }
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

function PopupContent({
  extensionAccounts,
  chain,
  votes,
  isLoadingVotes,
  voters,
  motionHash,
  motionIndex,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
  type,
}) {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState();

  const selectedAddress = selectedAccount?.address;
  const selectedAccountCanVote = voters.includes(selectedAddress);
  const currentVote = votes.find((item) => item[0] === selectedAddress);

  const api = useApi(chain);
  const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
  const isMounted = useIsMounted();

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (approve) => {
    if (isLoading) return;

    if (!voteMethod) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!motionHash || motionIndex === undefined) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setIsLoading(approve ? "Aye" : "Nay");

      const voterAddress = selectedAccount.address;

      const unsub = await voteMethod(
        motionHash,
        motionIndex,
        approve
      ).signAndSend(voterAddress, ({ events = [], status }) => {
        if (status.isFinalized) {
          onFinalized(voterAddress);
          unsub();
        }
        if (status.isInBlock) {
          // Transaction went through
          dispatch(updatePendingToast(toastId, "InBlock"));
          onInBlock(voterAddress);
        }
      });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(voterAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      dispatch(newErrorToast(e.message));
    } finally {
      if (isMounted.current) {
        setIsLoading(null);
      }
    }
  };

  return (
    <>
      <div>
        <LabelWrapper>
          <Label>Address</Label>
        </LabelWrapper>
        <SignerSelect
          api={api}
          chain={chain}
          extensionAccounts={extensionAccounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
        />
        {!selectedAccountCanVote && (
          <Info danger={!selectedAccountCanVote}>
            Only council members can vote.
          </Info>
        )}
      </div>
      <CurrentVotingWrapper>
        <LabelWrapper>
          <Label>Current Voting</Label>
        </LabelWrapper>
        {isLoadingVotes && (
          <CurrentVotingLoading>
            <Loading />
          </CurrentVotingLoading>
        )}
        {!isLoadingVotes &&
          (currentVote ? (
            <CurrentVoting>
              <div>Voting</div>
              {currentVote[1] ? (
                <div>
                  Aye
                  <img src="/imgs/icons/aye.svg" alt="" />
                </div>
              ) : (
                <div>
                  Nay
                  <img src="/imgs/icons/nay.svg" alt="" />
                </div>
              )}
            </CurrentVoting>
          ) : (
            <CurrentVotingNoData>No voting record</CurrentVotingNoData>
          ))}
        {!isLoadingVotes && currentVote && (
          <Message>
            Resubmitting the vote will override the current voting record
          </Message>
        )}
      </CurrentVotingWrapper>
      <ButtonWrapper>
        <Button
          primary
          background="#4CAF50"
          onClick={() => doVote(true)}
          isLoading={isLoading === "Aye"}
          disabled={isLoading}
        >
          Aye
        </Button>
        <Button
          primary
          background="#F44336"
          onClick={() => doVote(false)}
          isLoading={isLoading === "Nay"}
          disabled={isLoading}
        >
          Nay
        </Button>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Vote" Component={PopupContent} {...props} />;
}
