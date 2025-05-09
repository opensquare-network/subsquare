import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import RegistrarsDetailPopupContent from "./content";

export default function RegistrarsDetailPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Registrar Detail" onClose={onClose}>
        <RegistrarsDetailPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
