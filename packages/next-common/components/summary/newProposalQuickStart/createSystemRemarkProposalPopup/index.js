import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useRemarkNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/newRemarkProposalPopup";
import useRemarkField from "next-common/components/preImages/createPreimagePopup/fields/useRemarkField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import useTrackField from "../common/useTrackField";

export function NewRemarkReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { value: remark, component: remarkField } = useRemarkField();
  const { value: trackId, component: trackField } = useTrackField();
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useRemarkNotePreimageTx(remark);

  return (
    <Popup title="New Remark Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      {remarkField}
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
