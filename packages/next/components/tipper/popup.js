import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import BigNumber from "bignumber.js";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Button from "next-common/components/button";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import TipInput from "./tipInput";
import { getNode, toPrecision } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SignerSelect from "next-common/components/signerSelect";

const Info = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  color: #506176;
  font-size: 14px;
  line-height: 140%;
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

const balanceMap = new Map();

function PopupContent({
  extensionAccounts,
  chain,
  councilTippers,
  tipHash,
  onClose,
  onInBlock,
  onFinalized,
  onSubmitted,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inputTipValue, setInputTipValue] = useState();
  const [tipping, setTipping] = useState(false);
  const [balance, setBalance] = useState();
  const node = getNode(chain);

  const selectedAccountIsTipper = councilTippers.includes(
    selectedAccount?.address
  );

  const api = useApi(chain);

  useEffect(() => {
    if (balanceMap.has(selectedAccount?.address)) {
      setBalance(balanceMap.get(selectedAccount?.address));
      return;
    }
    setBalance();
    if (api && selectedAccount) {
      api.query.system.account(selectedAccount.address).then((result) => {
        if (isMounted.current) {
          const free = toPrecision(result.data.free, node.decimals);
          setBalance(free);
          balanceMap.set(selectedAccount.address, free);
        }
      });
    }
  }, [api, selectedAccount, node.decimals, isMounted]);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doEndorse = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!tipHash) {
      return;
    }

    if (!selectedAccount) {
      return showErrorToast("Please select an account");
    }

    if (!inputTipValue) {
      return showErrorToast("Please input tip value");
    }

    const bnInputTipValue = new BigNumber(inputTipValue);
    if (bnInputTipValue.isNaN() || bnInputTipValue.lt(0)) {
      return showErrorToast("Tip value is not valid");
    }

    if (!node) {
      return;
    }
    const decimals = node.decimals;

    const bnTipValue = bnInputTipValue.multipliedBy(Math.pow(10, decimals));
    if (!bnTipValue.mod(1).isZero()) {
      return showErrorToast("Tip value is not valid");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setTipping(true);

      const tipperAddress = selectedAccount.address;

      const unsub = await api.tx.tips
        .tip(tipHash, bnTipValue.toFixed())
        .signAndSend(tipperAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(tipperAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(updatePendingToast(toastId, "InBlock"));
            onInBlock(tipperAddress);
          }
        });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(tipperAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      showErrorToast(e.message);
    } finally {
      if (isMounted.current) {
        setTipping(false);
      }
    }
  };

  return (
    <>
      <Info danger={!selectedAccountIsTipper}>
        Only council members can tip.
      </Info>
      <div>
        <LabelWrapper>
          <Label>Address</Label>
          {balance && (
            <BalanceWrapper>
              <div>Balance</div>
              <div>{balance}</div>
            </BalanceWrapper>
          )}
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
        <Label>Tip Value</Label>
        <TipInput
          value={inputTipValue}
          setValue={setInputTipValue}
          symbol={node?.symbol}
        />
      </div>
      <ButtonWrapper>
        {selectedAccountIsTipper && api && inputTipValue ? (
          <Button secondary isLoading={tipping} onClick={doEndorse}>
            Endorse
          </Button>
        ) : (
          <Button disabled>Endorse</Button>
        )}
        <Button secondary isLoading={true} onClick={doEndorse}>
          Endorse
        </Button>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return <PopupWithAddress title="Tip" Component={PopupContent} {...props} />;
}
