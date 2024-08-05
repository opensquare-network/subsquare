import { usePopupParams } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import Popup from "next-common/components/popup/wrapper/Popup";
import useReferendumIndexField from "next-common/components/preImages/createPreimagePopup/fields/useReferendumIndexField";
import useTrackField from "../common/useTrackField";
import useEnactmentBlocksField from "../common/useEnactmentBlocksField";
import AdvanceSettings from "../common/advanceSettings";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { useListPageType } from "next-common/context/page";
import { useKillReferendumNotePreimageTx } from "next-common/components/preImages/createPreimagePopup/killReferendumPopup";

// Track ID on polkadot and kusama
const ReferendumKillerTrackID = 21;

export function KillReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField();
  const { value: trackId, component: trackField } = useTrackField(
    ReferendumKillerTrackID,
  );
  const { value: enactment, component: enactmentField } =
    useEnactmentBlocksField(trackId);

  const { encodedHash, encodedLength, notePreimageTx } =
    useKillReferendumNotePreimageTx(referendumIndex);

  const listPageType = useListPageType();

  let pallet = "referenda";
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  return (
    <Popup
      title="Kill A Referendum"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance title="Origin" />
      {referendumIndexField}
      {trackField}
      <AdvanceSettings>
        {enactmentField}
        <SubmissionDeposit pallet={pallet} />
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
