import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import SetSubsPopupContent from "./content";

export default function SetIdentityPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Set Subs" onClose={onClose}>
        <SetSubsPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
