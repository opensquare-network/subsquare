import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton, {
  useCreateProposalSubmitButton,
} from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useLocalTreasuryNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newLocalTreasuryProposalPopup";
import useBalanceField from "next-common/components/preImages/createPreimagePopup/fields/useBalanceField";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useAutoSelectTreasuryTrackField from "../common/useAutoSelectTreasuryTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import { useStepContainer } from "next-common/context/stepContainer";
import Button from "next-common/lib/button";
import CircleStepper from "next-common/components/step";

export function NewTreasuryReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(inputBalance);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useLocalTreasuryNotePreimageTx(inputBalance, beneficiary);

  return (
    <Popup title="Create Treasury Proposal" onClose={onClose}>
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      {trackField}
      <AdvanceSettings>
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

export function NewTreasuryReferendumInnerPopupContent() {
  const { goBack } = useStepContainer();
  const { value: inputBalance, component: balanceField } = useBalanceField();
  const { value: beneficiary, component: beneficiaryField } =
    useAddressComboField();
  const { value: trackId, component: trackField } =
    useAutoSelectTreasuryTrackField(inputBalance);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useLocalTreasuryNotePreimageTx(inputBalance, beneficiary);
  const {
    isLoading,
    component: submitButton,
    loadingTip,
  } = useCreateProposalSubmitButton({
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
      <SignerWithBalance />
      {balanceField}
      {beneficiaryField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit />
      </AdvanceSettings>
      {loadingTip}
      <div className="flex justify-between">
        <Button
          className={`border-neutral400 hover:border-neutral500 ${
            isLoading
              ? " cursor-not-allowed text-textDisabled border-neutral300"
              : ""
          }`}
          disabled={isLoading}
          onClick={goBack}
        >
          Previous
        </Button>
        {submitButton}
      </div>
    </>
  );
}
