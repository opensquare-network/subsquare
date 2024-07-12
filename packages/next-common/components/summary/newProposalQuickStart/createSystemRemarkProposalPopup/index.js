import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { usePageProps } from "next-common/context/page";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import EditorField from "next-common/components/popup/fields/editorField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useRemarkNotePreimageTx } from "next-common/components/preImages/submitPreimagePopup/newRemarkProposalPopup";

export function NewRemarkReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { tracks } = usePageProps();
  const [remark, setRemark] = useState("");

  let defaultTrackId = tracks[0].id;
  const chain = useChain();
  if ([Chains.polkadot, Chains.kusama].includes(chain)) {
    defaultTrackId = 2; // Wish for Change
  }

  const [trackId, setTrackId] = useState(defaultTrackId);
  const track = useTrackDetail(trackId);
  const [enactment, setEnactment] = useState();

  const { encodedHash, encodedLength, notePreimageTx } =
    useRemarkNotePreimageTx(remark);

  return (
    <Popup title="New Remark Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      <EditorField title="Remark" content={remark} setContent={setRemark} />
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      <AdvanceSettings>
        <EnactmentBlocks track={track} setEnactment={setEnactment} />
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
