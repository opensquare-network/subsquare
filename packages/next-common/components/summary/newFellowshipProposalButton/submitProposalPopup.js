import { useState } from "react";
import NewFellowshipProposalPopup from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";

export default function SubmitFellowshipProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      onClose={onClose}
      newProposalPopup={
        <NewFellowshipProposalPopup
          track={period}
          onClose={onClose}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    ></SubmitProposalPopupCommon>
  );
}
