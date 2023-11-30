import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useState } from "react";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import useApi from "next-common/utils/hooks/useApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { emptyFunction } from "next-common/utils";
import Signer from "next-common/components/popup/fields/signerField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import PopupLabel from "next-common/components/popup/label";
import styled from "styled-components";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

const Input = styled.input`
  background: var(--neutral200) !important;
  all: unset;
  padding: 12px 16px;
  flex-grow: 1;
  color: var(--textPrimary);
  box-sizing: border-box;
  width: 100%;
  border-radius: 4px;
`;

function PopupContent({
  pallet = "referenda",
  referendumIndex,
  onClose = emptyFunction,
}) {
  const api = useApi();
  const isMounted = useIsMounted();

  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const showErrorToast = (message) => dispatch(newErrorToast(message));
  const [calling, setCalling] = useState(false);

  const doRefund = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx[pallet].refundSubmissionDeposit(referendumIndex);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setCalling,
      onClose,
      signerAddress: signerAccount.address,
      isMounted,
    });
  };

  return (
    <>
      <Signer />
      <div>
        <PopupLabel text="Referendum Index" />
        <div>
          <Input disabled={true} value={referendumIndex} />
        </div>
      </div>
      <PopupButtonWrapper>
        <PrimaryButton isLoading={calling} onClick={doRefund}>
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function SubmissionDepositRefundPopup(props) {
  return (
    <PopupWithSigner
      title="Refund submission deposit"
      Component={PopupContent}
      {...props}
    />
  );
}
