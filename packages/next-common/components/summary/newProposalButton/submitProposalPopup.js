import { useState } from "react";
import NewProposalPopup from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);

  if (showNewProposalPopup) {
    return (
      <NewProposalPopup
        track={period}
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
      onClose={onClose}
    />
  );
}
