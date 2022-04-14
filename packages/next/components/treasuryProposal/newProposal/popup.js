import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";

import { useApi } from "utils/hooks";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Button from "next-common/components/button";
import {
  newErrorToast,
  newPendingToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "next-common/store/reducers/toastSlice";

import BalanceInput from "components/balanceInput";
import { getNode } from "utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import SignerSelect from "next-common/components/signerSelect";
import AddressCombo from "next-common/components/addressCombo";
import Tooltip from "next-common/components/tooltip";
import { encodeAddressToChain } from "next-common/services/address";
import { emptyFunction } from "next-common/utils";

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

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const TextBox = styled.div`
  display: flex;
  padding: 12px 16px;

  background: #f6f7fa;

  border: 1px solid #ebeef4;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
`;

function PopupContent({
  extensionAccounts,
  chain,
  onClose,
  onInBlock = emptyFunction,
  onFinalized = emptyFunction,
  onSubmitted = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [signerAccount, setSignerAccount] = useState(null);
  const [inputValue, setInputValue] = useState();
  const [loading, setLoading] = useState(false);
  const [bondPercentage, setBondPercentage] = useState("");
  const node = getNode(chain);

  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const [beneficiary, setBeneficiary] = useState(
    accounts[0]?.address && encodeAddressToChain(accounts[0]?.address, chain)
  );

  const api = useApi(chain);

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts.treasury.proposalBond.toHuman());
    }
  }, [api]);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAccount) {
      return showErrorToast("Please select an account");
    }

    if (!beneficiary) {
      return showErrorToast("Please input a beneficiary");
    }

    if (!inputValue) {
      return showErrorToast("Please input a value");
    }

    const bnValue = new BigNumber(inputValue).times(
      Math.pow(10, node.decimals)
    );
    if (bnValue.isNaN()) {
      return showErrorToast("Invalid value");
    }

    if (bnValue.lte(0)) {
      return showErrorToast("Value must be greater than 0");
    }

    if (!bnValue.mod(1).isZero()) {
      return showErrorToast("Invalid precision");
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setLoading(true);

      const signerAddress = signerAccount.address;

      const unsub = await api.tx.treasury
        .proposeSpend(bnValue.toString(), beneficiary)
        .signAndSend(signerAddress, ({ events = [], status }) => {
          if (status.isFinalized) {
            onFinalized(signerAddress);
            unsub();
          }
          if (status.isInBlock) {
            // Transaction went through
            dispatch(updatePendingToast(toastId, "InBlock"));
            for (const event of events) {
              const { section, method, data } = event.event;
              if (section !== "treasury" || method !== "Proposed") {
                continue;
              }
              const [proposalIndex] = data.toJSON();

              onInBlock(signerAddress, proposalIndex);
              break;
            }
          }
        });

      dispatch(updatePendingToast(toastId, "Broadcasting"));

      onSubmitted(signerAddress);

      onClose();
    } catch (e) {
      dispatch(removeToast(toastId));
      showErrorToast(e.message);
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
        </LabelWrapper>
        <SignerSelect
          api={api}
          chain={chain}
          selectedAccount={signerAccount}
          setSelectedAccount={setSignerAccount}
          extensionAccounts={extensionAccounts}
        />
      </div>
      <div>
        <LabelWrapper>
          <Label>Beneficiary</Label>
        </LabelWrapper>
        <AddressCombo
          chain={chain}
          address={beneficiary}
          setAddress={setBeneficiary}
          accounts={accounts}
        />
      </div>
      <div>
        <TooltipWrapper>
          <Label>Value</Label>
          <Tooltip
            content={"The amount that will be allocated from the treasury pot"}
          />
        </TooltipWrapper>
        <BalanceInput setValue={setInputValue} symbol={node?.symbol} />
      </div>
      <div>
        <TooltipWrapper>
          <Label>Proposal bond</Label>
          <Tooltip content={"The on-chain percentage for treasury"} />
        </TooltipWrapper>
        <TextBox>{bondPercentage}</TextBox>
      </div>

      <ButtonWrapper>
        <Button secondary isLoading={loading} onClick={submit}>
          Submit
        </Button>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="New Treasury Proposal"
      Component={PopupContent}
      {...props}
    />
  );
}
