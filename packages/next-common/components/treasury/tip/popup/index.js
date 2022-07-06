import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";

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
import Beneficiary from "./beneficiary";
import TipReason from "./tipReason";
import Signer from "./signer";

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

  const node = getNode(chain);

  const api = useApi(chain);

  const [beneficiary, setBeneficiary] = useState();

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

    const hexReason = "0x" + Buffer.from(reason).toString("hex");

    const toastId = newToastId();
    dispatch(newPendingToast(toastId, "Waiting for signing..."));

    try {
      setLoading(true);

      const signerAddress = signerAccount.address;

      const unsub = await api.tx.tips
        .reportAwesome(hexReason, beneficiary)
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
      <Signer
        api={api}
        chain={chain}
        signerAccount={signerAccount}
        setSignerAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
        node={node}
      />
      <Beneficiary
        chain={chain}
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <TipReason setValue={setReason} />
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
