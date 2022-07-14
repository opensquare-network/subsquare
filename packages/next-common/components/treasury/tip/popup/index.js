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
import Beneficiary from "../../common/beneficiary";
import TipReason from "./tipReason";
import Signer from "./signer";
import Tab, { ReportAwesome, NewTip } from "./tab";
import TipValue from "./tipValue";
import useAddressBalance from "../../../../utils/hooks/useAddressBalance";

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
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(ReportAwesome);
  const [inputValue, setInputValue] = useState("0");

  const node = getNode(chain);

  const api = useApi(chain);

  const [beneficiary, setBeneficiary] = useState();
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

    if (!reason) {
      return showErrorToast("Please input a reason");
    }

    let tx;

    if (tabIndex === NewTip) {
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

      tx = api.tx.tips.tipNew(reason, beneficiary, bnValue.toNumber());
    } else {
      tx = api.tx.tips.reportAwesome(reason, beneficiary);
    }

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setLoading(true);

      const signerAddress = signerAccount.address;

      const unsub = await tx.signAndSend(
        signerAddress,
        ({ events = [], status }) => {
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
              if (section !== "treasury" || method !== "NewTip") {
                continue;
              }
              const [tipHash] = data.toJSON();

              onInBlock(signerAddress, tipHash);
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
      <Tab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
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
      <TipReason setValue={setReason} />
      {tabIndex === NewTip && <TipValue chain={chain} setValue={setInputValue} />}
      <ButtonWrapper>
        <Button
          secondary
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
      title="New Tip"
      Component={PopupContent}
      {...props}
    />
  );
}
