import { useState } from "react";
import NewProposalPopup from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";
import ReferendumTemplates from "next-common/components/summary/newProposalButton/templates";

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      onClose={onClose}
      newProposalPopup={
        <NewProposalPopup
          track={period}
          onClose={onClose}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      <ReferendumTemplates onClose={onClose} />
    </SubmitProposalPopupCommon>
  );
}
