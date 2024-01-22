import { useState } from "react";
import NewDemocracyProposalPopup from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";

export default function SubmitDemocracyProposalPopup({ onClose }) {
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);

  if (showNewProposalPopup) {
    return (
      <NewDemocracyProposalPopup
        onClose={onClose}
        preimageHash={preimageHash}
        preimageLength={preimageLength}
      />
    );
  }

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      setShowNewProposalPopup={setShowNewProposalPopup}
    />
  );
}
