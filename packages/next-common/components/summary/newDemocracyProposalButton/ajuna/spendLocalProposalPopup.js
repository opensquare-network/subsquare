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
import { DemocracyProposeTxSubmissionButton } from "../common/democracyProposeTxSubmissionButton";
import SubmissionDeposit from "../common/submissionDeposit";

export default function AjunaSpendLocalProposalPopup() {
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

    return api.tx.treasury.spendLocal(value.toString(), beneficiary);
  }, [dispatch, api, decimals, inputBalance, beneficiary]);

  return (
    <Popup
      title="Spend treasury AJUN token"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
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
