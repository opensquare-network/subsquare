import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import RemoveSubPopupContent from "./removeSub";

export default function RemoveSubPopup({ onClose, selectedSub }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Remove Sub" onClose={onClose}>
        <RemoveSubPopupContent selectedSub={selectedSub} />
      </Popup>
    </SignerPopupWrapper>
  );
}
