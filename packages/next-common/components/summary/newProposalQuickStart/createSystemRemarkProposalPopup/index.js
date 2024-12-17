import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useRemarkNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/templates/newRemarkProposalPopup";
import useRemarkField from "next-common/components/preImages/createPreimagePopup/fields/useRemarkField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import useTrackField from "../common/useTrackField";
import { useDefaultTrackId } from "../../newProposalPopup/useTrackDetail";
import { useSubmissionDeposit } from "../common/useSubmissionDeposit";

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
