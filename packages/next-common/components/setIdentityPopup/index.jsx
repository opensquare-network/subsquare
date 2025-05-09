import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import SetIdentityPopupContent from "./content";

export default function SetIdentityPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Set Identity" onClose={onClose}>
        <SetIdentityPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
