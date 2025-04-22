import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import RequestJudgementPopupContent from "./content";

export default function SetIdentityPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Request Judgement" onClose={onClose}>
        <RequestJudgementPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
