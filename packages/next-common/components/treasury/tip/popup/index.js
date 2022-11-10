import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";

import { checkInputValue, emptyFunction } from "../../../../utils";
import PopupWithAddress from "../../../popupWithAddress";
import Beneficiary from "../../common/beneficiary";
import TipReason from "./tipReason";
import Signer from "./signer";
import Tab, { NewTip, ReportAwesome } from "./tab";
import TipValue from "./tipValue";
import useAddressBalance from "../../../../utils/hooks/useAddressBalance";
import { sendTx } from "../../../../utils/sendTx";
import SecondaryButton from "../../../buttons/secondaryButton";
import { useChainSettings } from "../../../../context/chain";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function PopupContent({
  extensionAccounts,
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
  const { decimals } = useChainSettings();
  const api = useApi();

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
      let bnValue;
      try {
        bnValue = checkInputValue(inputValue, decimals, "tip value");
      } catch (err) {
        return showErrorToast(err.message);
      }

      tx = api.tx.tips.tipNew(reason, beneficiary, bnValue.toNumber());
    } else {
      tx = api.tx.tips.reportAwesome(reason, beneficiary);
    }

    const signerAddress = signerAccount.address;

    await sendTx({
      tx,
      dispatch,
      setLoading,
      onFinalized,
      onInBlock: (eventData) => {
        const [tipHash] = eventData;
        onInBlock(signerAddress, tipHash);
      },
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
      section: "tips",
      method: "NewTip",
    });
  };

  return (
    <>
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Tab tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
      <Signer
        signerAccount={signerAccount}
        setSignerAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
        balance={balance}
        balanceIsLoading={balanceIsLoading}
      />
      <Beneficiary
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <TipReason setValue={setReason} />
      {tabIndex === NewTip && <TipValue setValue={setInputValue} />}
      <ButtonWrapper>
        <SecondaryButton isLoading={loading} onClick={submit}>
          Submit
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="New Tip" Component={PopupContent} {...props} />
  );
}
