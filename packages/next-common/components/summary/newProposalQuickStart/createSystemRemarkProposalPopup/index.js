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
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import EditorField from "next-common/components/popup/fields/editorField";

function PopupContent() {
  const { tracks } = usePageProps();
  const api = useContextApi();
  const [remark, setRemark] = useState("");

  let defaultTrackId = tracks[0].id;
  const chain = useChain();
  if ([Chains.polkadot, Chains.kusama].includes(chain)) {
    defaultTrackId = 2; // Wish for Change
  }

  const [trackId, setTrackId] = useState(defaultTrackId);
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
