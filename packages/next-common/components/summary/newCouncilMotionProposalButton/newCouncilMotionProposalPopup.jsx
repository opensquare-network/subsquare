import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SubmitCouncilMotionProposalPopupCommon from "./common";

export default function NewCouncilMotionProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <NewCouncilMotionProposalInnerPopup />
    </SignerPopupWrapper>
  );
}

function NewCouncilMotionProposalInnerPopup() {
  return <SubmitCouncilMotionProposalPopupCommon />;
}
