import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithVotingBalance from "next-common/components/signerPopup/signerWithVotingBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import {
  DemocracyProposeTxSubmissionButton,
  useDemocracyProposeTxFunc,
} from "next-common/components/summary/newDemocracyProposalButton/common/democracyProposeTxSubmissionButton";
import SubmissionDeposit from "next-common/components/summary/newDemocracyProposalButton/common/submissionDeposit";
import EstimatedGas from "next-common/components/estimatedGas";

export function NewTreasuryReferendumInnerPopup() {
  const api = useContextApi();
  const { onClose } = usePopupParams();
  const { decimals } = useChainSettings();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();

  const getTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    if (!beneficiary) {
      throw new Error("Beneficiary address is required");
    }

    if (!inputBalance) {
      throw new Error("Request balance is required");
    }

    const value = checkInputValue(
      inputBalance,
      decimals,
      "Request balance",
      false,
    );

    return api.tx.democracy.spendFromTreasury(value.toString(), beneficiary);
  }, [api, decimals, inputBalance, beneficiary]);
  const getProposeTxFunc = useDemocracyProposeTxFunc(getTxFunc);

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithVotingBalance />
      {balanceField}
      {beneficiaryField}
      <AdvanceSettings>
        <SubmissionDeposit />
        <EstimatedGas getTxFunc={getProposeTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <DemocracyProposeTxSubmissionButton getTxFunc={getTxFunc} />
      </div>
    </Popup>
  );
}
