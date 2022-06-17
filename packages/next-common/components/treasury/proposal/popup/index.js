import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";

import useApi from "../../../../utils/hooks/useSelectedEnpointApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import Button from "../../../button";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
  updatePendingToast,
} from "../../../../store/reducers/toastSlice";

import { getNode } from "utils";
import PopupWithAddress from "../../../popupWithAddress";
import { emptyFunction } from "../../../../utils";
import ProposalBond from "./proposalBond";
import Beneficiary from "./beneficiary";
import ProposalValue from "./proposalValue";
import Signer from "./signer";
import useAddressBalance from "../../../../utils/hooks/useAddressBalance";
import { WarningMessage } from "../../../popup/styled";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
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
  const [bond, setBond] = useState();
  const node = getNode(chain);

  const [beneficiary, setBeneficiary] = useState();

  const api = useApi(chain);

  const [balance, balanceIsLoading] = useAddressBalance(
    api,
    signerAccount?.address
  );

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
            dispatch(removeToast(toastId));
            dispatch(newSuccessToast("InBlock"));

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

  const balanceInsufficient = new BigNumber(bond).gt(balance);
  const disabled = balanceInsufficient || !new BigNumber(inputValue).gt(0);

  return (
    <>
      <Signer
        api={api}
        chain={chain}
        signerAccount={signerAccount}
        setSignerAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
        node={node}
        balance={balance}
        balanceIsLoading={balanceIsLoading}
      />
      <Beneficiary
        chain={chain}
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <ProposalValue chain={chain} setValue={setInputValue} />
      <ProposalBond
        chain={chain}
        inputValue={inputValue}
        node={node}
        balance={balance}
        setBond={setBond}
      />
      {balanceInsufficient && (
        <WarningMessage danger>Insufficient balance</WarningMessage>
      )}
      <ButtonWrapper>
        <Button
          secondary
          disabled={disabled}
          isLoading={loading}
          onClick={submit}
        >
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
