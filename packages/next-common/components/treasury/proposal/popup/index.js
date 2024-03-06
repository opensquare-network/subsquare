import React, { useState } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import useIsMounted from "../../../../utils/hooks/useIsMounted";
import { newErrorToast } from "../../../../store/reducers/toastSlice";

import { checkInputValue, emptyFunction } from "../../../../utils";
import PopupWithSigner from "../../../popupWithSigner";
import ProposalBond from "./proposalBond";
import Beneficiary from "../../common/beneficiary";
import ProposalValue from "./proposalValue";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "../../../../utils/hooks/useAddressBalance";
import { WarningMessage } from "../../../popup/styled";
import useBond from "../../../../utils/hooks/useBond";
import { sendTx, wrapWithProxy } from "../../../../utils/sendTx";
import PrimaryButton from "../../../buttons/primaryButton";
import { useChainSettings } from "../../../../context/chain";
import { PopupButtonWrapper } from "../../../popup/wrapper";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

function PopupContent() {
  const {
    onClose,
    onInBlock = emptyFunction,
    onFinalized = emptyFunction,
    onSubmitted = emptyFunction,
  } = usePopupParams();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const signerAccount = useSignerAccount();
  const extensionAccounts = useExtensionAccounts();

  const [inputValue, setInputValue] = useState();
  const [loading, setLoading] = useState(false);

  const node = useChainSettings();
  const api = useContextApi();

  const proposalValue = new BigNumber(inputValue).times(
    Math.pow(10, node.decimals),
  );
  const bond = useBond({
    api,
    proposalValue,
  });

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
      return showErrorToast("Please select an account");
    }

    if (!beneficiary) {
      return showErrorToast("Please input a beneficiary");
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputValue, node.decimals);
    } catch (err) {
      return showErrorToast(err.message);
    }

    let tx = api.tx.treasury.proposeSpend(bnValue.toString(), beneficiary);

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading,
      onFinalized,
      onInBlock: (eventData) => {
        const [proposalIndex] = eventData;
        onInBlock(signerAccount?.address, proposalIndex);
      },
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
      section: "treasury",
      method: "Proposed",
    });
  };

  const balanceInsufficient = new BigNumber(bond).gt(balance);
  const disabled = balanceInsufficient || !new BigNumber(inputValue).gt(0);

  return (
    <>
      <Signer
        balance={balance}
        isBalanceLoading={balanceIsLoading}
        signerBalance={signerBalance}
        isSignerBalanceLoading={isSignerBalanceLoading}
      />
      <Beneficiary
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
      <ProposalValue setValue={setInputValue} />
      <ProposalBond bond={bond} node={node} />
      {balanceInsufficient && (
        <WarningMessage danger>Insufficient balance</WarningMessage>
      )}
      <PopupButtonWrapper>
        <PrimaryButton disabled={disabled} isLoading={loading} onClick={submit}>
          Submit
        </PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function Popup(props) {
  return (
    <PopupWithSigner title="New Treasury Proposal" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
