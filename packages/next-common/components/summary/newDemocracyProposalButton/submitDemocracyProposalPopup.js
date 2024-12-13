import { useState } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider from "next-common/context/forwardPopup";
import { AjunaDemocracyProposalQuickStart } from "./ajuna/quickStart";

export function SubmitDemocracyProposalInnerPopup({ children }) {
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
      {children}
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup>
          <AjunaDemocracyProposalQuickStart />
        </SubmitDemocracyProposalInnerPopup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
