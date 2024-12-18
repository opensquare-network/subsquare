import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithVotingBalance from "next-common/components/signerPopup/signerWithVotingBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { checkInputValue } from "next-common/utils";
import { DemocracyProposeTxSubmissionButton } from "next-common/components/summary/newDemocracyProposalButton/common/democracyProposeTxSubmissionButton";
import SubmissionDeposit from "next-common/components/summary/newDemocracyProposalButton/common/submissionDeposit";

export function NewTreasuryReferendumInnerPopup() {
  const dispatch = useDispatch();
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
      dispatch(newErrorToast("Beneficiary address is required"));
      return;
    }

    if (!inputBalance) {
      dispatch(newErrorToast("Request balance is required"));
      return;
    }

    let value = null;
    try {
      value = checkInputValue(inputBalance, decimals, "Request balance", false);
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    return api.tx.democracy.spendFromTreasury(value.toString(), beneficiary);
  }, [dispatch, api, decimals, inputBalance, beneficiary]);

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithVotingBalance />
      {balanceField}
      {beneficiaryField}
      <AdvanceSettings>
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <DemocracyProposeTxSubmissionButton getTxFunc={getTxFunc} />
      </div>
    </Popup>
  );
}
