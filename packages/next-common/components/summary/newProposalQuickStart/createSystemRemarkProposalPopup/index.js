import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import CreateProposalSubmitButton, {
  useCreateProposalSubmitButton,
} from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useRemarkNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newRemarkProposalPopup";
import useRemarkField from "next-common/components/preImages/createPreimagePopup/fields/useRemarkField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import useTrackField from "../common/useTrackField";
import { useDefaultTrackId } from "../../newProposalPopup/useTrackDetail";
import { useSubmissionDeposit } from "../common/useSubmissionDeposit";
import { useStepContainer } from "next-common/context/stepContainer";
import Button from "next-common/lib/button";
import CircleStepper from "next-common/components/step";

export function NewRemarkReferendumInnerPopup() {
  const defaultTrackId = useDefaultTrackId();

  const { onClose } = usePopupParams();
  const { value: remark, component: remarkField } = useRemarkField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const { component: submissionDepositField } = useSubmissionDeposit();

  const { encodedHash, encodedLength, notePreimageTx } =
    useRemarkNotePreimageTx(remark);

  return (
    <Popup title="New Remark Proposal" onClose={onClose}>
      <SignerWithBalance />
      {remarkField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        {submissionDepositField}
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

export function NewRemarkReferendumInnerPopupContent() {
  const defaultTrackId = useDefaultTrackId();
  const { value: remark, component: remarkField } = useRemarkField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);
  const { component: submissionDepositField } = useSubmissionDeposit();

  const { encodedHash, encodedLength, notePreimageTx } =
    useRemarkNotePreimageTx(remark);
  const { goBack } = useStepContainer();
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
      <SignerWithBalance />
      {remarkField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        {submissionDepositField}
      </AdvanceSettings>
      <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium">
        After submitting the transaction, you&apos;ll be redirected to the
        referendum detail page to edit content.
      </div>
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
