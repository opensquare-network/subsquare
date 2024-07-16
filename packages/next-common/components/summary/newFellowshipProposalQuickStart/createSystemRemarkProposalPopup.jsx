import DetailedFellowshipTrack from "next-common/components/popup/fields/detailedFellowshipTrackField";
import EditorField from "next-common/components/popup/fields/editorField";
import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import {
  useCollectivesContext,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import { useMemo, useState } from "react";
import { useFellowshipTrackDetail } from "../newFellowshipProposalPopup/useFellowshipTrackDetail";
import EnactmentBlocks from "../newProposalPopup/enactmentBlocks";
import SubmissionDeposit from "../newProposalPopup/submissionDeposit";
import AdvanceSettings from "../newProposalQuickStart/common/advanceSettings";
import CreateFellowshipProposalSubmitButton from "./common/createProposalSubmitButton";

export default function NewFellowshipRemarkReferendumInnerPopup() {
  const { onClose } = usePopupParams();
  const { section } = useCollectivesContext();
  const api = useContextApi();
  const { fellowshipTracks, ambassadorTracks } = usePageProps();
  const [remark, setRemark] = useState("");
  const pallet = useReferendaFellowshipPallet();

  let trackList;
  let defaultTrackId;
  if (section === "fellowship") {
    trackList = fellowshipTracks;
    defaultTrackId = 3; // fellows
  } else if (section === "ambassador") {
    trackList = ambassadorTracks;
    defaultTrackId = trackList[0].id;
  }

  const [trackId, setTrackId] = useState(defaultTrackId);
  const track = useFellowshipTrackDetail(trackId);
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
    <Popup title="New Remark Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      <EditorField title="Remark" content={remark} setContent={setRemark} />
      <DetailedFellowshipTrack trackId={trackId} setTrackId={setTrackId} />
      <AdvanceSettings>
        <EnactmentBlocks track={track} setEnactment={setEnactment} />
        <SubmissionDeposit pallet={pallet} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <CreateFellowshipProposalSubmitButton
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
