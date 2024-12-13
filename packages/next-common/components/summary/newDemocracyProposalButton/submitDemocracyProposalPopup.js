import { useState } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider from "next-common/context/forwardPopup";
import { AjunaDemocracyProposalQuickStart } from "./ajuna/quickStart";

export function SubmitDemocracyProposalInnerPopup() {
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      newProposalPopup={
        <NewDemocracyProposalInnerPopup
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      <AjunaDemocracyProposalQuickStart />
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup />
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
