import DetailedTrack from "next-common/components/popup/fields/DetailedTrackField";
import SignerPopup from "next-common/components/signerPopup";
import { useState } from "react";
import PreimageField from "./preimageField";
import EnactmentBlocks from "./enactmentBlocks";

export default function NewProposalPopup({ onClose }) {
  const [track, setTrack] = useState();
  return (
    <SignerPopup wide title="New Proposal" onClose={onClose}>
      <DetailedTrack track={track} setTrack={setTrack} />
      <PreimageField />
      <EnactmentBlocks />
    </SignerPopup>
  );
}
