import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SubmitMotionProposalPopupCommon from "./common";

export default function PromoteMotionPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <PromoteMotionInnerPopup />
    </SignerPopupWrapper>
  );
}

function PromoteMotionInnerPopup() {
  return <SubmitMotionProposalPopupCommon></SubmitMotionProposalPopupCommon>;
}
