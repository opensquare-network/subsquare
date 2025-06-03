import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton, {
  useCreateProposalSubmitButton,
} from "../common/createProposalSubmitButton";
import { InfoMessage } from "next-common/components/setting/styled";
import AdvanceSettings from "../common/advanceSettings";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useValidFromField from "next-common/components/preImages/createPreimagePopup/fields/useValidFromField";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useStepContainer } from "next-common/context/stepContainer";
import CircleStepper from "next-common/components/step";
import SigningTip from "../common/signingTip";
import InsufficientBalanceTips from "../common/insufficientBalanceTips";
import PreviousButton from "../../newProposalButton/previousButton";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import { useTreasurySpendNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newTreasurySpendReferendumInnerPopup";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export function NewTreasurySpendReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(inputBalance);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useTreasurySpendNotePreimageTx(inputBalance, beneficiary, validFrom);

  return (
    <Popup title="Create Treasury Spend Proposal" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      {trackField}
      <AdvanceSettings>
        {validFromField}
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateProposalSubmitButton
          trackId={trackId}
          enactment={enactment}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          notePreimageTx={notePreimageTx}
        />
      </div>
    </Popup>
  );
}

export function NewTreasurySpendReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: validFrom, component: validFromField } = useValidFromField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(inputBalance);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useTreasurySpendNotePreimageTx(inputBalance, beneficiary, validFrom);

  const { isLoading, component: submitButton } = useCreateProposalSubmitButton({
    trackId,
    enactment,
    encodedHash,
    encodedLength,
    notePreimageTx,
  });

  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "templateSelect",
            label: "Template Select",
          },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={1}
        loading={isLoading}
      />
      <SignerWithBalance showTransferable />
      {balanceField}
      <div className="flex flex-col gap-[8px]">
        {beneficiaryField}
        <InfoMessage>
          Please input an AssetHub address as the beneficiary
        </InfoMessage>
      </div>
      {trackField}
      <AdvanceSettings>
        {validFromField}
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      <InsufficientBalanceTips byteLength={encodedLength} />
      <SigningTip />
      <div className="flex justify-between">
        <PreviousButton isLoading={isLoading} onClick={goBack} />
        {submitButton}
      </div>
    </>
  );
}
