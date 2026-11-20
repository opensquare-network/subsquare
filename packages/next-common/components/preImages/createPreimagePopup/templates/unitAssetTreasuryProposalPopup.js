import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useBalanceField from "../fields/useBalanceField";
import useAddressComboField from "../fields/useAddressComboField";
import useValidFromField from "../fields/useValidFromField";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useTreasurySpendNotePreimageTx } from "next-common/hooks/useTreasurySpendNotePreimageTx";

// `TREASURY_SPEND_FORMS.unitAsset`, see utils/treasury/spendForm.js:
// `treasury.spend(null, amount, account, validFrom)`, the asset kind is the unit
// type and the beneficiary a plain account. Spends are claimed with `payout`.
export default function UnitAssetTreasuryProposalPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useTreasurySpendNotePreimageTx(inputBalance, beneficiary, validFrom);

  return (
    <Popup title="Create Treasury Spend" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      {validFromField}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} preimageOnly />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={() => notePreimageTx} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
