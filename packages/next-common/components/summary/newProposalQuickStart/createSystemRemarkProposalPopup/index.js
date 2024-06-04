import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo, useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import { usePageProps } from "next-common/context/page";
import EnactmentBlocks from "../../newProposalPopup/enactmentBlocks";
import CreateProposalSubmitButton from "../common/createProposalSubmitButton";
import AdvanceSettings from "../common/advanceSettings";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import PopupLabel from "next-common/components/popup/label";
import Editor from "next-common/components/editor";

function PopupContent() {
  const { tracks } = usePageProps();
  const api = useContextApi();
  const [remark, setRemark] = useState("");
  const [trackId, setTrackId] = useState(tracks[0].id);
  const track = useTrackDetail(trackId);
  const [enactment, setEnactment] = useState();

  const { encodedHash, encodedLength, notePreimageTx } = useMemo(() => {
    if (!api || !remark) {
      return {};
    }

    try {
      const proposal = api.tx.system.remark(remark);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, remark]);

  return (
    <>
      <SignerWithBalance title="Origin" />
      <div>
        <PopupLabel text="Remark" />
        <Editor
          value={remark}
          onChange={setRemark}
          contentType={"markdown"}
          minHeight={100}
        />
      </div>
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
    </>
  );
}

export default function NewRemarkReferendumPopup({ onClose }) {
  return (
    <PopupWithSigner title="New Remark Proposal" onClose={onClose} wide>
      <PopupContent />
    </PopupWithSigner>
  );
}
