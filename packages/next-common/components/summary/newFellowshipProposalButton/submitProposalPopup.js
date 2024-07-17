import { useState } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { NewRemarkReferendumInnerPopup } from "../newProposalQuickStart/createSystemRemarkProposalPopup";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";

export default function SubmitFellowshipProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);

  let content;
  if (showNewRemarkPopup) {
    content = <NewRemarkReferendumInnerPopup />;
  } else {
    content = (
      <SubmitProposalPopupCommon
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
        newProposalPopup={
          <NewFellowshipProposalInnerPopup
            track={period}
            preimageHash={preimageHash}
            preimageLength={preimageLength}
          />
        }
      >
        <QuickStart>
          <ChoiceButton
            name="Remark"
            description="Creating a remark proposal"
            onClick={() => setShowNewRemarkPopup(true)}
          />
        </QuickStart>
      </SubmitProposalPopupCommon>
    );
  }

  return <SignerPopupWrapper onClose={onClose}>{content}</SignerPopupWrapper>;
}
