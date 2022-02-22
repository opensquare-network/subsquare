import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";
import { useApi, useAddressVotingBalance, useAddressVote } from "utils/hooks";
import Button from "next-common/components/button";
import { addToast } from "store/reducers/toastSlice";

import { getNode, toPrecision } from "utils";
import Input from "next-common/components/input";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";
import Tooltip from "next-common/components/tooltip";
import SignerSelect from "next-common/components/signerSelect";
import PopupWithAddress from "next-common/components/popupWithAddress";
import Loading from "./loading";
import DisplayValue from "./displayValue";

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
  onSubmitted = () => {},
  onFinalized = () => {},
  onInBlock = () => {},
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

  const api = useApi(chain);

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

    const bnVotingBalance = new BigNumber(votingBalance).multipliedBy(
      Math.pow(10, decimals)
    );
    if (bnVoteBalance.gt(bnVotingBalance)) {
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
        .vote(referendumIndex, { aye, balance: bnVoteBalance.toFixed() })
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
      setIsLoading(null);
    }
  };

  return (
    <>
      <div>
        <LabelWrapper>
          <Label>Address</Label>
          <BalanceWrapper>
            <div>Voting Balance</div>
            {!votingIsLoading && <div>{votingBalance ?? 0}</div>}
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
                  <DisplayValue
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
