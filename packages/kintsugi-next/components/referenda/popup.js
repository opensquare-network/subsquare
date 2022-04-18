import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";
import { useApi, useAddressVotingBalance, useAddressVote } from "utils/hooks";
import Button from "next-common/components/button";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import { getNode, toPrecision } from "utils";
import Input from "next-common/components/input";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";
import Tooltip from "next-common/components/tooltip";
import SignerSelect from "next-common/components/signerSelect";
import PopupWithAddress from "next-common/components/popupWithAddress";
import Loading from "next-common/components/loading";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import ValueDisplay from "next-common/components/displayValue";
import { emptyFunction } from "next-common/utils";

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
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

  & > .balance {
    cursor: pointer;
  }
`;

const StatusWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: #9da9bb;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    > svg {
      margin-left: 8px;
    }
  }
  > img {
    margin: 0 auto;
  }
  > div.no-data {
    font-size: 14px;
    line-height: 100%;
    color: #9da9bb;
    flex-grow: 1;
    text-align: center;
  }
`;

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }

  margin-bottom: 8px;
`;

const WarningWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 140%;
  color: #506176;
  margin-top: 8px;
`;

function PopupContent({
  extensionAccounts,
  chain,
  referendumIndex,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const node = getNode(chain);
  const [isLoading, setIsLoading] = useState();
  const [votingBalance, votingIsLoading] = useAddressVotingBalance(
    selectedAccount?.address
  );
  const [addressVote, addressVoteIsLoading] = useAddressVote(
    referendumIndex,
    selectedAccount?.address
  );
  const [inputVoteBalance, setInputVoteBalance] = useState("0");
  const isMounted = useIsMounted();

  const api = useApi(chain);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doVote = async (aye) => {
    if (isLoading || referendumIndex == null || !node) {
      return;
    }

    if (!inputVoteBalance) {
      return showErrorToast("Please input vote balance");
    }

    const decimals = node.decimals;
    const bnVoteBalance = new BigNumber(inputVoteBalance).multipliedBy(
      Math.pow(10, decimals)
    );

    if (bnVoteBalance.isNaN()) {
      return showErrorToast("Invalid vote balance");
    }

    if (bnVoteBalance.lte(0) || !bnVoteBalance.mod(1).isZero()) {
      return showErrorToast("Invalid vote balance");
    }

    const bnVotingBalance = new BigNumber(votingBalance).multipliedBy(
      Math.pow(10, decimals)
    );
    if (bnVoteBalance.gt(bnVotingBalance)) {
      return showErrorToast("Insufficient voting balance");
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setIsLoading(aye ? "Aye" : "Nay");

      const voteAddress = selectedAccount.address;

      const unsub = await api.tx.democracy
        .vote(referendumIndex, { aye, balance: bnVoteBalance.toFixed() })
        .signAndSend(voteAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(voteAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(updatePendingToast(toastId, "InBlock"));
            onInBlock(voteAddress);
          }
        });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(voteAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      showErrorToast(e.message);
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
              <div
                className="balance"
                onClick={() => setInputVoteBalance(votingBalance ?? 0)}
              >
                {votingBalance ?? 0}
              </div>
            )}
            {votingIsLoading && <Loading />}
          </BalanceWrapper>
        </LabelWrapper>
        <SignerSelect
          api={api}
          chain={chain}
          extensionAccounts={extensionAccounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          disabled={isLoading}
        />
      </div>
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
          <Label>Voting status</Label>
        </TooltipWrapper>
        <StatusWrapper>
          {!addressVoteIsLoading &&
            (addressVote ? (
              <>
                <div className="value">
                  <ValueDisplay
                    value={toPrecision(addressVote?.balance, node.decimals)}
                    symbol={node?.voteSymbol}
                  />
                </div>
                {addressVote?.aye ? (
                  <div className="result">
                    Aye
                    <ApproveIcon />
                  </div>
                ) : (
                  <div className="result">
                    Nay
                    <RejectIcon />
                  </div>
                )}
              </>
            ) : (
              <div className="no-data">No voting record</div>
            ))}
          {addressVoteIsLoading && <Loading size={14} />}
        </StatusWrapper>
        {addressVote && (
          <WarningWrapper>
            Resubmitting the vote will override the current voting record
          </WarningWrapper>
        )}
      </div>
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
