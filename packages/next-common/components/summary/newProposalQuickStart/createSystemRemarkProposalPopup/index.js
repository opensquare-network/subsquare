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
import { useListPageType, usePageProps } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export function NewRemarkReferendumInnerPopup() {
  const listPageType = useListPageType();
  const chain = useChain();

  let pallet = "referenda";
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    pallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    pallet = "ambassadorReferenda";
  }

  const { tracks, fellowshipTracks, ambassadorTracks } = usePageProps();

  let trackList;
  let defaultTrackId;

  if (listPageType === listPageCategory.REFERENDA) {
    trackList = tracks;
    defaultTrackId = tracks[0].id;
    if ([Chains.polkadot, Chains.kusama].includes(chain)) {
      defaultTrackId = 2; // Wish for Change
    }
  } else if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    trackList = fellowshipTracks;
    defaultTrackId = 3; // fellows
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    trackList = ambassadorTracks;
    defaultTrackId = trackList[0].id;
  }

  const { onClose } = usePopupParams();
  const { value: remark, component: remarkField } = useRemarkField();
  const { value: trackId, component: trackField } =
    useTrackField(defaultTrackId);
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
