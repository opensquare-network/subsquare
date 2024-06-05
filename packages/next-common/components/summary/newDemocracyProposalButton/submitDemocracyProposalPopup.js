import { useState } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

export default function SubmitDemocracyProposalPopup({ onClose }) {
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <SubmitProposalPopupCommon
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
        newProposalPopup={
          <NewDemocracyProposalInnerPopup
            preimageHash={preimageHash}
            preimageLength={preimageLength}
          />
        }
      />
    </SignerPopupWrapper>
  );
}
