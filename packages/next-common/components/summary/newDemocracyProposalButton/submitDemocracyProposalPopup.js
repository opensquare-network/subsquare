import { useState } from "react";
import NewDemocracyProposalPopup from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";

export default function SubmitDemocracyProposalPopup({ onClose }) {
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      onClose={onClose}
      newProposalPopup={
        <NewDemocracyProposalPopup
          onClose={onClose}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    />
  );
}
