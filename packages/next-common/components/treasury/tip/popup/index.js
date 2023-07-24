import React, { useState } from "react";
import { useDispatch } from "react-redux";

import useApi from "../../../../utils/hooks/useApi";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";

import { checkInputValue, emptyFunction } from "../../../../utils";
import PopupWithAddress from "../../../popupWithAddress";
import Beneficiary from "../../common/beneficiary";
import TipReason from "./tipReason";
import Signer from "next-common/components/popup/fields/signerField";
import Tab, { NewTip, ReportAwesome } from "./tab";
import TipValue from "./tipValue";
import useAddressBalance from "../../../../utils/hooks/useAddressBalance";
import { sendTx, wrapWithProxy } from "../../../../utils/sendTx";
import PrimaryButton from "../../../buttons/primaryButton";
import { useChainSettings } from "../../../../context/chain";
import useSignerAccount from "../../../../utils/hooks/useSignerAccount";
import { PopupButtonWrapper } from "../../../popup/wrapper";

function PopupContent({
  extensionAccounts,
  onClose,
  onInBlock = emptyFunction,
  onFinalized = emptyFunction,
  onSubmitted = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const signerAccount = useSignerAccount(extensionAccounts);

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(ReportAwesome);
  const [inputValue, setInputValue] = useState("0");
  const { decimals } = useChainSettings();
  const api = useApi();

  const [beneficiary, setBeneficiary] = useState();
  const [balance, balanceIsLoading] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );
  const [signerBalance, isSignerBalanceLoading] = useAddressBalance(
    api,
    signerAccount?.address,
  );

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!signerAccount) {
      return showErrorToast("Please login first");
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

      tx = api.tx.tips.tipNew(reason, beneficiary, bnValue.toString());
    } else {
      tx = api.tx.tips.reportAwesome(reason, beneficiary);
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
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
        balance={balance}
        isBalanceLoading={balanceIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <Beneficiary
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <TipReason setValue={setReason} />
      {tabIndex === NewTip && <TipValue setValue={setInputValue} />}
      <PopupButtonWrapper>
        <PrimaryButton isLoading={loading} onClick={submit}>
          Submit
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithAddress title="New Tip" Component={PopupContent} {...props} />
  );
}
