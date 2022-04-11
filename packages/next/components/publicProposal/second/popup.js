import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Button from "next-common/components/button";
import {
  addToast,
  newToastId,
  updateToast,
} from "next-common/store/reducers/toastSlice";

import BalanceInput from "./balanceInput";
import { getNode, toPrecision } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SignerSelect from "next-common/components/signerSelect";
import Loading from "./loading";
import Tooltip from "next-common/components/tooltip";

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
  justify-content: flex-end;
`;

const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  padding: 12px 16px;

  background: #fff1f0;
  border-radius: 4px;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;

  color: #f44336;
  margin-top: 8px !important;
`;

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  chain,
  proposalIndex,
  depositorUpperBound,
  depositRequired,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const node = getNode(chain);

  const api = useApi(chain);

  const deposit =
    depositRequired || api?.consts?.democracy?.minimumDeposit?.toString();
  const displayDepositRequired = toPrecision(deposit, node.decimals);

  const balanceInsufficient = new BigNumber(balance).lt(deposit);

  useEffect(() => {
    if (balanceMap.has(selectedAccount?.address)) {
      setBalance(balanceMap.get(selectedAccount?.address));
      return;
    }
    if (api && selectedAccount) {
      setLoadingBalance(true);
      api.query.system
        .account(selectedAccount.address)
        .then((result) => {
          if (isMounted.current) {
            const free = toPrecision(result.data.free, node.decimals);
            setBalance(free);
            balanceMap.set(selectedAccount.address, free);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setLoadingBalance(false);
          }
        });
    }
  }, [api, selectedAccount, node.decimals, isMounted]);

  const submit = async () => {
    if (!api) {
      dispatch(
        addToast({
          type: "error",
          message: "Chain network is not connected yet",
        })
      );
      return;
    }

    if (!proposalIndex) {
      return;
    }

    if (!selectedAccount) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select an account",
        })
      );
      return;
    }

    const toastId = newToastId();
    dispatch(
      addToast({
        type: "pending",
        message: "Waiting for signing...",
        id: toastId,
        sticky: true,
      })
    );

    try {
      setLoading(true);

      const signerAddress = selectedAccount.address;

      const unsub = await api.tx.democracy
        .second(proposalIndex, depositorUpperBound || 0)
        .signAndSend(signerAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(signerAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(
              updateToast({
                type: "success",
                message: "InBlock",
                id: toastId,
                sticky: false,
              })
            );
            onInBlock(signerAddress);
          }
        });

      dispatch(
        updateToast({
          message: "Broadcasting",
          id: toastId,
        })
      );

      onSubmitted(signerAddress);

      onClose();
    } catch (e) {
      dispatch(
        updateToast({
          type: "error",
          message: e.message,
          id: toastId,
          sticky: false,
        })
      );
    } finally {
      if (isMounted.current) {
        setLoading(null);
      }
    }
  };

  return (
    <>
      <div>
        <LabelWrapper>
          <Label>Address</Label>
          <BalanceWrapper>
            <div>Balance</div>
            <div>{loadingBalance ? <Loading /> : balance}</div>
          </BalanceWrapper>
        </LabelWrapper>
        <SignerSelect
          api={api}
          chain={chain}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          extensionAccounts={extensionAccounts}
        />
      </div>
      <div>
        <TooltipWrapper>
          <Label>Deposit</Label>
          <Tooltip
            content={
              "The deposit will be locked for the lifetime of the proposal"
            }
          />
        </TooltipWrapper>
        <BalanceInput
          disabled={true}
          value={displayDepositRequired}
          symbol={node?.symbol}
        />
      </div>
      {balanceInsufficient && <ErrorMessage>Insufficient balance</ErrorMessage>}
      <ButtonWrapper>
        {balanceInsufficient ? (
          <Button disabled>Submit</Button>
        ) : (
          <Button secondary isLoading={loading} onClick={submit}>
            Submit
          </Button>
        )}
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="Second" Component={PopupContent} {...props} />
  );
}
