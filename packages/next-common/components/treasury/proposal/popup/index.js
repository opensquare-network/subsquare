import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

import { checkInputValue } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import ProposalBond from "./proposalBond";
import ProposalValue from "./proposalValue";
import Signer from "next-common/components/popup/fields/signerField";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import { WarningMessage } from "next-common/components/popup/styled";
import useBond from "next-common/utils/hooks/useBond";
import { useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { noop } from "lodash-es";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import { useTreasuryPallet } from "next-common/context/treasury";

function useProposalBond({ proposalValue }) {
  const pallet = useTreasuryPallet();
  const bond = useBond({
    pallet,
    proposalValue,
  });

  return {
    value: bond,
    component: <ProposalBond bond={bond} />,
  };
}

function PopupContent() {
  const { onInBlock = noop } = usePopupParams();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const pallet = useTreasuryPallet();

  const api = useContextApi();
  const { decimals } = useChainSettings();

  const [inputValue, setInputValue] = useState();
  const proposalValue = new BigNumber(inputValue).times(Math.pow(10, decimals));
  const { value: bond, component: bondComponent } = useProposalBond({
    pallet,
    proposalValue,
  });
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const [balance, balanceIsLoading] = useAddressBalance(
    api,
    signerAccount?.realAddress,
  );

  const getTxFunc = useCallback(async () => {
    if (!beneficiary) {
      dispatch(newErrorToast("Please input a beneficiary"));
      return;
    }

    let bnValue;
    try {
      bnValue = checkInputValue(inputValue, decimals);
    } catch (err) {
      dispatch(newErrorToast(err.message));
      return;
    }

    return api.tx[pallet].proposeSpend(bnValue.toString(), beneficiary);
  }, [pallet, beneficiary, inputValue, decimals, api, dispatch]);

  const balanceInsufficient = new BigNumber(bond).gt(balance);
  const disabled = balanceInsufficient || !new BigNumber(inputValue).gt(0);

  return (
    <>
      <Signer balance={balance} isBalanceLoading={balanceIsLoading} />
      {beneficiaryField}
      <ProposalValue setValue={setInputValue} />
      {bondComponent}
      {balanceInsufficient && (
        <WarningMessage danger>Insufficient balance</WarningMessage>
      )}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        disabled={disabled}
        onInBlock={onInBlock}
      />
    </>
  );
}

export default function NewTreasuryProposalPopup(props) {
  return (
    <PopupWithSigner title="New Treasury Proposal" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
