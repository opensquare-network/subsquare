import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";
import { useApi, useAddressVotingBalance, useAddressVote } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import SignerSelect from "next-common/components/signerSelect";
import Button from "next-common/components/button";
import { addToast } from "next-common/store/reducers/toastSlice";

import { getNode, toPrecision } from "utils";
import Input from "next-common/components/input";
import Select from "components/select";
import Tooltip from "next-common/components/tooltip";
import Loading from "../loading";
import { isAye, getConviction } from "utils/referendumUtil";
import { TooltipWrapper, Label } from "./styled";
import StandardVoteStatus from "./standardVoteStatus";
import SplitVoteStatus from "./splitVoteStatus";
import DelegateVoteStatus from "./delegateVoteStatus";
import NoVoteRecord from "./noVoteRecord";
import LoadingVoteStatus from "./loadingVoteStatus";
import Delegating from "./delegating";
import Delegations from "./delegations";

import PopupWithAddress from "next-common/components/popupWithAddress";

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

function PopupContent({
  extensionAccounts,
  chain,
  referendumIndex,
  onClose,
  onSubmitted = () => {},
  onFinalized = () => {},
  onInBlock = () => {},
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [selectedAccount, setSelectedAccount] = useState(null);

  const api = useApi(chain);
  const node = getNode(chain);

  const [isLoading, setIsLoading] = useState();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    selectedAccount?.address,
    chain
  );

  const [addressVote, addressVoteIsLoading] = useAddressVote(
    referendumIndex,
    selectedAccount?.address,
    chain
  );

  const addressVoteStandardBalance = addressVote?.standard?.balance;
  const addressVoteStandardAye = isAye(addressVote?.standard?.vote);
  const addressVoteStandardConviction = getConviction(
    addressVote?.standard?.vote
  );
  const addressVoteDelegations = addressVote?.delegations?.votes;

  const addressVoteSplitAye = addressVote?.split?.aye;
  const addressVoteSplitNay = addressVote?.split?.nay;

  const addressVoteDelegateBalance = addressVote?.delegating?.balance;
  const addressVoteDelegateVoted = addressVote?.delegating?.voted;
  const addressVoteDelegateAye = addressVote?.delegating?.aye;
  const addressVoteDelegateConviction = addressVote?.delegating?.conviction;
  const addressVoteDelegateTarget = addressVote?.delegating?.target;

  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const [voteLock, setVoteLock] = useState(0);

  const doVote = async (aye) => {
    if (isLoading || referendumIndex == null || !node) {
      return;
    }

    if (!inputVoteBalance) {
      dispatch(
        addToast({
          type: "error",
          message: "Please input vote balance",
        })
      );
      return;
    }

    let errorMessage = null;
    const decimals = node.decimals;
    const bnVoteBalance = new BigNumber(inputVoteBalance).multipliedBy(
      Math.pow(10, decimals)
    );

    if (bnVoteBalance.isNaN()) {
      errorMessage = { type: "error", message: "Invalid vote balance" };
    }

    if (bnVoteBalance.lte(0) || !bnVoteBalance.mod(1).isZero()) {
      errorMessage = { type: "error", message: "Invalid vote balance" };
    }

    if (bnVoteBalance.gt(votingBalance)) {
      errorMessage = {
        type: "error",
        message: "Insufficient voting balance",
      };
    }

    if (!selectedAccount) {
      errorMessage = { type: "error", message: "Please select an account" };
    }

    if (!api) {
      errorMessage = {
        type: "error",
        message: "Chain network is not connected yet",
      };
    }

    if (errorMessage) {
      dispatch(addToast(errorMessage));
      return;
    }

    try {
      setIsLoading(aye ? "Aye" : "Nay");

      const voteAddress = selectedAccount.address;

      const unsub = await api.tx.democracy
        .vote(referendumIndex, {
          Standard: {
            balance: bnVoteBalance.toFixed(),
            vote: {
              aye,
              conviction: voteLock,
            },
          },
        })
        .signAndSend(voteAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(voteAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            onInBlock(voteAddress);
          }
        })
        .then(() => onSubmitted(voteAddress));

      onClose();
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(
          addToast({
            type: "error",
            message: e.message,
          })
        );
      }
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
          <BalanceWrapper>
            <div>Voting Balance</div>
            {!votingIsLoading && (
              <div>{toPrecision(votingBalance ?? 0, node.decimals)}</div>
            )}
            {votingIsLoading && <Loading />}
          </BalanceWrapper>
        </LabelWrapper>
        <SignerSelect
          chain={chain}
          api={api}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          disabled={isLoading}
          extensionAccounts={extensionAccounts}
        />
      </div>
      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <>
          {addressVoteDelegations ? (
            <Delegations
              addressVoteDelegations={addressVoteDelegations}
              node={node}
            />
          ) : null}
          <div>
            <TooltipWrapper>
              <Label>Value</Label>
              <Tooltip content="The value is locked for the duration of the vote" />
            </TooltipWrapper>
            <Input
              type="text"
              placeholder="0"
              disabled={isLoading}
              value={inputVoteBalance}
              onChange={(e) =>
                setInputVoteBalance(e.target.value.replace("。", "."))
              }
              symbol={node?.voteSymbol}
            />
          </div>
          <div>
            <TooltipWrapper>
              <Label>Vote lock</Label>
            </TooltipWrapper>
            <Select value={voteLock} setValue={setVoteLock} disabled={false} />
          </div>
        </>
      )}

      {addressVote?.delegating && (
        // If the address has set to delegate mode, show the delegating setting instead
        <Delegating
          addressVoteDelegateBalance={addressVoteDelegateBalance}
          addressVoteDelegateConviction={addressVoteDelegateConviction}
          addressVoteDelegateTarget={addressVoteDelegateTarget}
          node={node}
        />
      )}

      {!addressVoteIsLoading &&
        !addressVote?.standard &&
        !addressVote?.split &&
        (!addressVote?.delegating || !addressVoteDelegateVoted) && (
          <NoVoteRecord />
        )}
      {addressVote?.standard && (
        <StandardVoteStatus
          addressVoteStandardBalance={addressVoteStandardBalance}
          addressVoteStandardConviction={addressVoteStandardConviction}
          addressVoteStandardAye={addressVoteStandardAye}
          node={node}
        />
      )}
      {addressVote?.split && (
        <SplitVoteStatus
          addressVoteSplitAye={addressVoteSplitAye}
          addressVoteSplitNay={addressVoteSplitNay}
          node={node}
        />
      )}
      {addressVote?.delegating && addressVoteDelegateVoted && (
        <DelegateVoteStatus addressVoteDelegateAye={addressVoteDelegateAye} />
      )}
      {addressVoteIsLoading && <LoadingVoteStatus />}

      {!addressVote?.delegating && (
        // Address is not allow to vote directly when it is in delegate mode
        <ButtonWrapper>
          <Button
            primary
            background="#4CAF50"
            onClick={() => doVote(true)}
            isLoading={isLoading === "Aye"}
            disabled={isLoading && isLoading !== "Aye"}
          >
            Aye
          </Button>
          <Button
            primary
            background="#F44336"
            onClick={() => doVote(false)}
            isLoading={isLoading === "Nay"}
            disabled={isLoading && isLoading !== "Nay"}
          >
            Nay
          </Button>
        </ButtonWrapper>
      )}
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Referenda vote"
      Component={PopupContent}
      {...props}
    />
  );
}
